const URL_GOOGLE_SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsRsYR1FmAckjSHkFktW09uCTw2ou4K8sMMt-Sma-MO_Ag3s_T7MS54idpQXDYEBNrKtFGQAOpk_8D/pub?gid=0&single=true&output=csv";
let registros = [];

function normalizarEncabezado(valor) {
    return valor
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function parsearCSV(texto) {
    const filas = [];
    let fila = [];
    let celda = "";
    let dentroDeComillas = false;

    for (let i = 0; i < texto.length; i++) {
        const caracter = texto[i];

        if (caracter === '"') {
            if (dentroDeComillas && texto[i + 1] === '"') {
                celda += '"';
                i++;
            } else {
                dentroDeComillas = !dentroDeComillas;
            }
        } else if (caracter === "," && !dentroDeComillas) {
            fila.push(celda.trim());
            celda = "";
        } else if ((caracter === "\n" || caracter === "\r") && !dentroDeComillas) {
            if (caracter === "\r" && texto[i + 1] === "\n") i++;
            fila.push(celda.trim());
            if (fila.some(valor => valor !== "")) filas.push(fila);
            fila = [];
            celda = "";
        } else {
            celda += caracter;
        }
    }

    fila.push(celda.trim());
    if (fila.some(valor => valor !== "")) filas.push(fila);
    return filas;
}

function buscarColumna(encabezados, variantes) {
    const opciones = new Set(variantes.map(normalizarEncabezado));
    return encabezados.findIndex(encabezado => opciones.has(normalizarEncabezado(encabezado)));
}

function leerRegistrosCSV(texto) {
    const filas = parsearCSV(texto);
    if (filas.length < 2) {
        throw new Error("La hoja publicada no contiene filas de datos.");
    }

    const variantes = {
        facultad: ["facultad", "facultad/asociacion", "facultad asociacion", "asociacion"],
        cargo: ["cargo", "cargo directivo", "dignidad"],
        nombre: ["nombre", "nombre registrado", "nombres", "nombres completos", "representante"],
        estado: ["estado", "estatus", "status"]
    };

    const esFilaEncabezados = fila =>
        ["facultad", "cargo", "nombre"].every(campo =>
            buscarColumna(fila, variantes[campo]) >= 0
        );
    const seccionesPrincipales = new Map([
        ["gremiosestudiantiles", "Gremios Estudiantiles"],
        ["asociacionesextensionescampussede", "Asociaciones - Extensiones, Campus y Sede"],
        ["asociacionesestudiantilesmatriz", "Asociaciones Estudiantiles - Matriz"]
    ]);
    let seccionActual = "Directiva Estudiantil";
    let subseccionActual = "General";
    let columnas = null;
    const resultado = [];

    filas.forEach((fila, indiceFila) => {
        if (esFilaEncabezados(fila)) {
            columnas = Object.fromEntries(
                Object.entries(variantes).map(([campo, opciones]) => [
                    campo,
                    buscarColumna(fila, opciones)
                ])
            );
            return;
        }

        const celdasConTexto = fila
            .map((valor, indice) => ({ valor: valor.trim(), indice }))
            .filter(celda => celda.valor !== "");

        if (celdasConTexto.length === 1) {
            const encabezado = celdasConTexto[0].valor;
            const claveEncabezado = normalizarEncabezado(encabezado);
            const seccionPrincipal = seccionesPrincipales.get(claveEncabezado);

            if (seccionPrincipal) {
                seccionActual = seccionPrincipal;
                subseccionActual = "";
            } else if (!columnas && indiceFila === 0) {
                return;
            } else {
                subseccionActual = encabezado;
            }
            return;
        }

        if (!columnas || celdasConTexto.length === 0) return;

        const estado = columnas.estado < 0
            ? "activo"
            : normalizarEncabezado(fila[columnas.estado] || "");
        const registro = {
            id: resultado.length + 1,
            facultad: (fila[columnas.facultad] || "").trim(),
            cargo: (fila[columnas.cargo] || "").trim(),
            nombre: (fila[columnas.nombre] || "").trim(),
            estado: ["activo", "vigente", "aprobado", "aprobada"].includes(estado) ? "activo" : "pendiente",
            seccion: seccionActual,
            subseccion: subseccionActual || "General"
        };

        if (registro.facultad && registro.cargo && registro.nombre) {
            resultado.push(registro);
        }
    });

    if (!columnas) {
        throw new Error("No se encontró una fila con los encabezados Facultad, Cargo y Nombre.");
    }

    return resultado;
}

function mostrarEstadoTabla(mensaje, esError = false) {
    const estado = document.getElementById("table-status");
    estado.textContent = mensaje;
    estado.classList.toggle("error", esError);
}

function crearTablaGrupo(registrosGrupo) {
    const tabla = document.createElement("table");
    const thead = tabla.createTHead();
    const filaEncabezados = thead.insertRow();
    ["Facultad / Asociación", "Cargo", "Nombre Registrado", "Estado", "Acción"].forEach(texto => {
        const encabezado = document.createElement("th");
        encabezado.scope = "col";
        encabezado.textContent = texto;
        filaEncabezados.appendChild(encabezado);
    });

    const tbody = tabla.createTBody();
    registrosGrupo.forEach(reg => {
        const tr = document.createElement('tr');
        [reg.facultad, reg.cargo].forEach(valor => {
            const celda = tr.insertCell();
            celda.textContent = valor;
        });

        const celdaNombre = tr.insertCell();
        const nombre = document.createElement("strong");
        nombre.textContent = reg.nombre;
        celdaNombre.appendChild(nombre);

        const celdaEstado = tr.insertCell();
        const etiquetaEstado = document.createElement("span");
        etiquetaEstado.className = reg.estado === "activo" ? "status active" : "status pending";
        etiquetaEstado.textContent = reg.estado === "activo" ? "Vigente" : "En Revisión";
        celdaEstado.appendChild(etiquetaEstado);

        const celdaAccion = tr.insertCell();
        const boton = document.createElement("button");
        boton.className = "btn-update";
        boton.type = "button";
        boton.textContent = "✎ Proponer Cambio";
        boton.addEventListener("click", () => abrirModal(reg.id, reg.facultad, reg.cargo));
        celdaAccion.appendChild(boton);

        tbody.appendChild(tr);
    });
    return tabla;
}

// Organiza los registros siguiendo los encabezados de agrupación de la hoja.
function cargarTabla() {
    const contenedor = document.getElementById("directiva-groups");
    contenedor.replaceChildren();

    const secciones = new Map();
    registros.forEach(registro => {
        if (!secciones.has(registro.seccion)) secciones.set(registro.seccion, new Map());
        const subsecciones = secciones.get(registro.seccion);
        if (!subsecciones.has(registro.subseccion)) subsecciones.set(registro.subseccion, []);
        subsecciones.get(registro.subseccion).push(registro);
    });

    secciones.forEach((subsecciones, nombreSeccion) => {
        const seccion = document.createElement("section");
        seccion.className = "directory-section";

        const titulo = document.createElement("h3");
        titulo.className = "directory-section-title";
        titulo.textContent = nombreSeccion;
        seccion.appendChild(titulo);

        subsecciones.forEach((miembros, nombreSubseccion) => {
            const grupo = document.createElement("details");
            grupo.className = "directory-subgroup";

            const resumen = document.createElement("summary");
            resumen.textContent = `${nombreSubseccion} (${miembros.length})`;
            grupo.appendChild(resumen);

            const tablaContenedor = document.createElement("div");
            tablaContenedor.className = "table-container";
            tablaContenedor.appendChild(crearTablaGrupo(miembros));
            grupo.appendChild(tablaContenedor);
            seccion.appendChild(grupo);
        });

        contenedor.appendChild(seccion);
    });

    if (registros.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay registros completos para mostrar.";
        contenedor.appendChild(mensaje);
    }
}

async function cargarDirectivaDesdeGoogleSheets() {
    mostrarEstadoTabla("Cargando directiva...");
    try {
        const respuesta = await fetch(URL_GOOGLE_SHEETS_CSV, { cache: "no-store" });
        if (!respuesta.ok) {
            throw new Error(`Google Sheets respondió con estado ${respuesta.status}.`);
        }

        registros = leerRegistrosCSV(await respuesta.text());
        cargarTabla();
        mostrarEstadoTabla(`${registros.length} registro(s) cargado(s) desde Google Sheets.`);
    } catch (error) {
        console.error("No se pudo cargar la directiva desde Google Sheets:", error);
        cargarTabla();
        mostrarEstadoTabla(`No se pudo cargar la hoja: ${error.message} Verifica que esté publicada como CSV y que los encabezados incluyan Facultad, Cargo y Nombre.`, true);
    }
}

// Control del Modal (Ventana emergente)
function abrirModal(id, facultad, cargo) {
    document.getElementById('modalOverlay').style.display = 'flex';
    document.getElementById('modal-cargo-facultad').innerText = `${cargo} - ${facultad}`;
    document.getElementById('registro-id').value = id;
}

function cerrarModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('updateForm').reset();
}

// Envío de datos (Estructura lista para Google Sheets)
// Envío de datos a Google Sheets
function enviarAprobacion() {
    const idRegistro = document.getElementById('registro-id').value;
    const nuevoNombre = document.getElementById('nuevo-nombre').value;
    const justificacion = document.getElementById('justificacion').value;
    const linkEvidencia = document.getElementById('link-evidencia').value;
    
    if(!nuevoNombre || !justificacion) {
        alert("Por favor, llene los campos obligatorios.");
        return;
    }

    const btn = document.querySelector('.btn-submit');
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const datos = {
        id: idRegistro,
        nombre: nuevoNombre,
        acta: justificacion,
        evidencia: linkEvidencia
    };

    // PEGA TU URL DE APPS SCRIPT AQUÍ ADENTRO:
    const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbz47qRU0o6MSNKHXRbQT86qt-Y86qH0P5Bjki_Yq03SPAqf3EpYM53rSrOwar5QZWQFrg/exec";
      
    // Enviar los datos sin bloqueo de seguridad (CORS)
    fetch(URL_GOOGLE_SCRIPT, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === "éxito") {
            alert("✅ Solicitud enviada exitosamente. El cambio se reflejará una vez aprobado.");
            cerrarModal();
        } else {
            alert("Hubo un error al enviar: " + data.mensaje);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("✅ Solicitud enviada. (Verifique en Google Sheets)");
        cerrarModal();
    })
    .finally(() => {
        btn.innerText = "Enviar para Aprobación Oficial";
        btn.disabled = false;
    });
}

// Buscador en tiempo real, manteniendo visibles las secciones con coincidencias.
document.getElementById("searchInput").addEventListener("input", function(event) {
    const texto = event.target.value.trim().toLocaleLowerCase("es");
    let coincidencias = 0;

    document.querySelectorAll("#directiva-groups .directory-section").forEach(seccion => {
        let tieneCoincidencias = false;
        const coincideSeccion = texto
            && seccion.querySelector(".directory-section-title").textContent.toLocaleLowerCase("es").includes(texto);

        seccion.querySelectorAll(".directory-subgroup").forEach(grupo => {
            let registrosVisibles = 0;
            const coincideSubgrupo = coincideSeccion
                || (texto && grupo.querySelector("summary").textContent.toLocaleLowerCase("es").includes(texto));

            grupo.querySelectorAll("tbody tr").forEach(fila => {
                const coincide = !texto || coincideSubgrupo
                    || fila.textContent.toLocaleLowerCase("es").includes(texto);
                fila.hidden = !coincide;
                if (coincide) registrosVisibles++;
            });
            grupo.hidden = registrosVisibles === 0;
            if (registrosVisibles > 0) {
                tieneCoincidencias = true;
                coincidencias += registrosVisibles;
                if (texto) grupo.open = true;
            }
        });
        seccion.hidden = !tieneCoincidencias;
    });

    mostrarEstadoTabla(texto
        ? `${coincidencias} registro(s) coinciden con la búsqueda.`
        : `${registros.length} registro(s) cargado(s) desde Google Sheets.`);
});

// Cargar la directiva publicada desde Google Sheets.
cargarDirectivaDesdeGoogleSheets();