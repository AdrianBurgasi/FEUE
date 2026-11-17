const CAMPUS_DATA = [
  {
    id: "bloque-16",
    codigo: "B-16",
    nombre: "Bloque 16",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidades Académicas • Sector Central Norte (Salas 09 a 14)",
    referencia: "Frente al Estadio Universitario, al norte del campus matriz.",
    zoomScale: 2.9,
    polygon: [
      [382, 396], [426, 336], [468, 372], [422, 438]
    ],
    salas: [
      { id: "sala-09", nombre: "Sala 09", x: 416, y: 360, detalle: "Aula / Sala académica • Planta Baja Ala Norte" },
      { id: "sala-10", nombre: "Sala 10", x: 438, y: 374, detalle: "Aula / Sala académica • Planta Baja Ala Este" },
      { id: "sala-11", nombre: "Sala 11", x: 404, y: 386, detalle: "Aula / Sala académica • Nivel Intermedio" },
      { id: "sala-12", nombre: "Sala 12", x: 428, y: 398, detalle: "Aula / Sala académica • Nivel Intermedio" },
      { id: "sala-13", nombre: "Sala 13", x: 396, y: 412, detalle: "Aula / Sala académica • Planta Alta Ala Sur" },
      { id: "sala-14", nombre: "Sala 14", x: 420, y: 422, detalle: "Aula / Sala académica • Planta Alta" }
    ]
  },
  {
    id: "bloque-016-norte",
    codigo: "FCS",
    nombre: "Fisioterapia",
    categoria: "bloque",
    etiquetaCategoria: "UNIDAD ACADÉMICA",
    facultad: "Anexo Norte • Cercano a Cancha de Césped Sintético y Calle S/N",
    referencia: "Extremo noroeste junto a Calle S/N y Tasty 1.",
    zoomScale: 3.4,
    polygon: [
      [112, 118], [124, 96], [150, 112], [138, 144]
    ],
    salas: [
      { id: "sala-09-ext", nombre: "Acceso 0-16", x: 130, y: 120, detalle: "Ingreso sector noroeste • Calle S/N" }
    ]
  },
  {
    id: "bloque-17",
    codigo: "FCSDB",
    nombre: "Comunicación",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Norte (Techo Rojo)",
    referencia: "Entre Calle S/N y el sector norte del Estadio Universitario.",
    zoomScale: 3.1,
    polygon: [
      [376, 228], [412, 184], [446, 214], [408, 268]
    ],
    salas: [
      { id: "b17-principal", nombre: "Planta Principal B-17", x: 410, y: 224, detalle: "Aulas y coordinación académica Bloque 17" }
    ]
  },
  {
    id: "bloque-02",
    codigo: "B-02",
    nombre: "Economia",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Edificio de Eduación • Sector Puerta 1 y Plaza Cultural",
    referencia: "Frente al Paraninfo, Ingreso Puerta 1.",
    zoomScale: 3.2,
    polygon: [
      [696, 514], [730, 472], [762, 502], [728, 554]
    ],
    salas: [
      { id: "sala-03", nombre: "Sala 03", x: 728, y: 512, detalle: "Sala 03 • Acceso directo desde Puerta 1 y Punto de Encuentro" }
    ]
  },
  {
    id: "bloque-05",
    codigo: "FAHP",
    nombre: "*Artes Pláticas, Arqueología, Artes escénicas, Diseño Textil e Indumentaria, Sociologia",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Sureste (Calle La Iglesia)",
    referencia: "Junto a las Canchas Múltiples Sureste y Tasty 4.",
    zoomScale: 3.2,
    polygon: [
      [718, 762], [756, 732], [784, 774], [744, 804]
    ],
    salas: [
      { id: "sala-04", nombre: "Sala 04", x: 750, y: 768, detalle: "Sala 04 • Sector sureste junto a Canchas Múltiples" }
    ]
  },
  {
    id: "bloque-07",
    codigo: "FIIA",
    nombre: "Arquitectura",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Sur del Estadio",
    referencia: "Al sur del Estadio Universitario y junto al edificio de cubierta terracota.",
    zoomScale: 3.0,
    polygon: [
      [492, 694], [546, 642], [590, 706], [536, 764]
    ],
    salas: [
      { id: "sala-05", nombre: "Sala 05", x: 540, y: 702, detalle: "Sala 05 • Edificio azul sur del Estadio Universitario" }
    ]
  },
  {
    id: "bloque-08",
    codigo: "BO-8",
    nombre: "Bloque 08",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Corredor Calle U8",
    referencia: "Sobre la Calle U8, entre Tasty 3 y el Bloque 07.",
    zoomScale: 2.9,
    polygon: [
      [366, 736], [390, 704], [486, 768], [464, 812]
    ],
    salas: [
      { id: "sala-06", nombre: "Sala 06", x: 404, y: 742, detalle: "Sala 06 • Ala Oeste Bloque 08 (junto a Tasty 3)" },
      { id: "sala-07", nombre: "Sala 07", x: 452, y: 774, detalle: "Sala 07 • Ala Este Bloque 08 sobre Calle U8" }
    ]
  },
  {
    id: "bloque-09",
    codigo: "B-9",
    nombre: "Bloque 09",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Calle U8 / Ciudadela Universitaria",
    referencia: "Entre Bloque 13 y Tasty 3 sobre Calle U8.",
    zoomScale: 3.2,
    polygon: [
      [272, 766], [322, 742], [338, 782], [284, 804]
    ],
    salas: [
      { id: "sala-08", nombre: "Sala 08", x: 294, y: 774, detalle: "Sala 08 • Ala Oeste Bloque 09" },
      { id: "sala-19", nombre: "Sala 19", x: 320, y: 766, detalle: "Sala 19 • Ala Este Bloque 09 (junto a Tasty 3)" }
    ]
  },
  {
    id: "bloque-10",
    codigo: "FCVT",
    nombre: "Ingeniería  Agropecuaria, Agronegocios, Agroindustrial, Ambiental, Tecnologías de la Información, Software, Sistema, Biología, Alimentos",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica y Administrativa • Sector Suroeste",
    referencia: "Sobre Calle U8, entre Bloque 12 y Bloque 13.",
    zoomScale: 3.3,
    polygon: [
      [134, 796], [166, 766], [184, 818], [150, 844]
    ],
    salas: [
      { id: "b10-aula", nombre: "Aulas Bloque 10", x: 158, y: 804, detalle: "Edificio verde sobre Calle U8 • Sector Suroeste" }
    ]
  },
  {
    id: "bloque-12",
    codigo: "B-12",
    nombre: "Bloque 12 (PB-12)",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Extremo Suroeste",
    referencia: "Junto a Tasty 2 y parqueadero suroeste sobre Calle U8.",
    zoomScale: 3.3,
    polygon: [
      [70, 748], [104, 736], [114, 784], [80, 796]
    ],
    salas: [
      { id: "sala-20", nombre: "Sala 20", x: 92, y: 766, detalle: "Sala 20 • Bloque 12 (PB-12) junto a Tasty 2" }
    ]
  },
  {
    id: "bloque-13",
    codigo: "FCACC",
    nombre: "Contabilidad y Auditoria",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Suroeste",
    referencia: "Entre Bloque 14, Bloque 10 y Bloque 09.",
    zoomScale: 3.0,
    polygon: [
      [182, 718], [244, 668], [278, 726], [216, 784]
    ],
    salas: [
      { id: "sala-17", nombre: "Sala 17", x: 214, y: 734, detalle: "Sala 17 • Ala Suroeste Bloque 13" },
      { id: "sala-18", nombre: "Sala 18", x: 246, y: 706, detalle: "Sala 18 • Ala Noreste Bloque 13" }
    ]
  },
  {
    id: "bloque-14",
    codigo: "FCSDB",
    nombre: "Trabajo Social",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Unidad Académica • Sector Oeste (Techo Rojo)",
    referencia: "Al norte del Bloque 13 y al este de Canchas Múltiples Oeste.",
    zoomScale: 3.0,
    polygon: [
      [206, 636], [260, 582], [284, 622], [228, 678]
    ],
    salas: [
      { id: "sala-16", nombre: "Sala 16", x: 244, y: 630, detalle: "Sala 16 • Bloque 14 (cubierta roja)" }
    ]
  },
  {
    id: "bloque-jma",
    codigo: "JMA",
    nombre: "Unidad Educativa Juan Montalvo",
    categoria: "bloque",
    etiquetaCategoria: "UNIDAD EDUCATIVA / HISTÓRICO",
    facultad: "Unidad Educativa Juan Montalvo • Edificio Patrimonial",
    referencia: "Sector oeste, junto a las Canchas Múltiples y Tasty 2.",
    zoomScale: 3.1,
    polygon: [
      [50, 474], [112, 452], [126, 514], [64, 538]
    ],
    salas: [
      { id: "sala-22", nombre: "Sala 22", x: 88, y: 494, detalle: "Sala 22 • Juan Montalvo Bloque Antiguo" }
    ]
  },
  {
    id: "bloque-jmn",
    codigo: "FCSDB",
    nombre: "Derecho-Criminologia-Relaciones Internacionales",
    categoria: "bloque",
    etiquetaCategoria: "BLOQUE ACADÉMICO",
    facultad: "Complejo Académico • Sector Sur Central",
    referencia: "Junto al Bloque 07 y al sur del Estadio Universitario.",
    zoomScale: 3.0,
    polygon: [
      [564, 638], [614, 586], [656, 654], [608, 706]
    ],
    salas: [
      { id: "sala-21", nombre: "Sala 21", x: 610, y: 646, detalle: "Sala 21 • Bloque Nuevo sector Estadio / BO-7" }
    ]
  },
  {
    id: "cac",
    codigo: "C.A.C.",
    nombre: "Centro de Atención Ciudadana",
    categoria: "servicio",
    etiquetaCategoria: "SERVICIO INSTITUCIONAL",
    facultad: "Atención al Estudiante y Ciudadanía • Psicologia y Guarderia",
    referencia: "Entre Plaza Cultural, Bloque 02 y Estadio Universitario.",
    zoomScale: 3.1,
    polygon: [
      [626, 412], [658, 382], [704, 454], [672, 484]
    ],
    salas: [
      { id: "cac-ventanilla", nombre: "Ventanillas C.A.C.", x: 664, y: 432, detalle: "Atención académica, certificados y orientación ciudadana" }
    ]
  },
  {
    id: "estadio-universitario",
    codigo: "ESTADIO",
    nombre: "Estadio Universitario ULEAM",
    categoria: "deporte",
    etiquetaCategoria: "INFRAESTRUCTURA DEPORTIVA",
    facultad: "Escenario Deportivo Principal • Eventos Institucionales y Cultura",
    referencia: "Corazón central del Campus Matriz en Manta.",
    zoomScale: 2.3,
    polygon: [
      [426, 540], [458, 434], [546, 376], [612, 418], [596, 534], [506, 638], [440, 616]
    ],
    salas: [
      { id: "estadio-grama", nombre: "Cancha Principal", x: 520, y: 506, detalle: "Césped reglamentario y pista atlética" },
      { id: "estadio-tribuna", nombre: "Tribuna Principal", x: 568, y: 562, detalle: "Graderío techado • Acceso sector sur" }
    ]
  },
  {
    id: "plaza-cultural",
    codigo: "PLAZA",
    nombre: "Plaza Centenario ULEAM y DBU",
    categoria: "deporte",
    etiquetaCategoria: "ESPACIO CULTURAL Y CÍVICO",
    facultad: "Explanada de Eventos, Actos Solemnes y Encuentro Estudiantil",
    referencia: "Frente al Ingreso Puerta 1 y junto DBU",
    zoomScale: 2.8,
    polygon: [
      [708, 362], [768, 318], [826, 392], [764, 436]
    ],
    salas: [
      { id: "plaza-explanada", nombre: "Explanada Central", x: 766, y: 378, detalle: "Plaza abierta con emblema institucional ULEAM" }
    ]
  },
  {
    id: "puerta-1",
    codigo: "PUERTA 1",
    nombre: "Ingreso Puerta 1",
    categoria: "servicio",
    etiquetaCategoria: "ACCESO PRINCIPAL",
    facultad: "Garita de Control Principal • Av. Circunvalación",
    referencia: "Acceso vehicular y peatonal principal junto al Monumento Eloy Alfaro.",
    zoomScale: 3.4,
    polygon: [
      [834, 412], [862, 392], [878, 434], [850, 452]
    ],
    salas: [
      { id: "puerta1-control", nombre: "Control de Acceso", x: 856, y: 422, detalle: "Ingreso directo hacia Plaza Cultural, C.A.C. y Punto de Encuentro" }
    ]
  },
  {
    id: "monumento-alfaro",
    codigo: "MONUMENTO",
    nombre: "Monumento Eloy Alfaro",
    categoria: "deporte",
    etiquetaCategoria: "HITO HISTÓRICO",
    facultad: "Paraninfo Alfonso Aguilar de Bienvenida • General Eloy Alfaro Delgado",
    referencia: "A la derecha del Ingreso Puerta 1.",
    zoomScale: 3.3,
    polygon: [
      [842, 514], [876, 486], [906, 528], [872, 556]
    ],
    salas: [
      { id: "monumento-faro", nombre: "Monumento Central", x: 874, y: 520, detalle: "Punto de referencia emblemático en el ingreso principal" }
    ]
  },
  {
    id: "punto-encuentro",
    codigo: "FET",
    nombre: "Educación Inicial - Punto de Encuentro",
    categoria: "servicio",
    etiquetaCategoria: "SEGURIDAD Y REUNIÓN",
    facultad: "Carrera de Educación - Zona Segura y Punto de Reunión Estudiantil",
    referencia: "Entre Bloque 02 e Ingreso Puerta 1.",
    zoomScale: 3.2,
    polygon: [
      [736, 554], [768, 494], [804, 524], [774, 592]
    ],
    salas: [
      { id: "zona-segura", nombre: "Zona Segura Puerta 1", x: 770, y: 542, detalle: "Área despejada de concentración y orientación" }
    ]
  },
  {
    id: "cancha-sintetica",
    codigo: "SINTÉTICA",
    nombre: "Cancha de Césped Sintético",
    categoria: "deporte",
    etiquetaCategoria: "ÁREA DEPORTIVA",
    facultad: "Complejo Recreacional y Deportivo Noroeste",
    referencia: "Junto a Tasty 1 y el acceso por Calle S/N.",
    zoomScale: 3.1,
    polygon: [
      [86, 212], [116, 174], [160, 206], [134, 264]
    ],
    salas: [
      { id: "sintetica-campo", nombre: "Cancha Sintética", x: 124, y: 218, detalle: "Cancha de fútbol rápido • Sector Noroeste" }
    ]
  },
  {
    id: "canchas-multiples-oeste",
    codigo: "CANCHAS O.",
    nombre: "Canchas Múltiples (Sector Oeste)",
    categoria: "deporte",
    etiquetaCategoria: "ÁREA DEPORTIVA",
    facultad: "Canchas de Uso Múltiple • Baloncesto y Ecuavóley",
    referencia: "Entre Juan Montalvo y Bloque 14.",
    zoomScale: 2.9,
    polygon: [
      [90, 528], [138, 492], [190, 594], [142, 636]
    ],
    salas: [
      { id: "cancha-o1", nombre: "Cancha Norte", x: 128, y: 540, detalle: "Pista deportiva multifunción" },
      { id: "cancha-o2", nombre: "Cancha Sur", x: 152, y: 588, detalle: "Pista deportiva junto a Tasty 2" }
    ]
  },
  {
    id: "canchas-multiples-sur",
    codigo: "CANCHAS S.E.",
    nombre: "Canchas Múltiples (Sector Sureste)",
    categoria: "deporte",
    etiquetaCategoria: "ÁREA DEPORTIVA",
    facultad: "Complejo Deportivo Sureste • Calle U8 y Calle La Iglesia",
    referencia: "Entre Tasty 4 y Bloque 05.",
    zoomScale: 2.9,
    polygon: [
      [662, 804], [708, 766], [755, 862], [708, 902]
    ],
    salas: [
      { id: "cancha-se1", nombre: "Cancha 1 (Norte)", x: 702, y: 810, detalle: "Cancha múltiple junto a Bloque 05" },
      { id: "cancha-se2", nombre: "Cancha 2 (Sur)", x: 720, y: 856, detalle: "Cancha múltiple sobre Calle U8" }
    ]
  },
  {
    id: "zona-tasty",
    codigo: "TASTY 1–4",
    nombre: "Puntos de Alimentación Tasty",
    categoria: "servicio",
    etiquetaCategoria: "CAFETERÍAS Y SERVICIOS",
    facultad: "Red de Cafeterías Universitarias (Tasty 1, 2, 3 y 4)",
    referencia: "Distribuidos estratégicamente en los 4 cuadrantes del campus.",
    zoomScale: 2.2,
    polygon: [
      [332, 724], [354, 702], [376, 732], [354, 756]
    ],
    salas: [
      { id: "tasty-1", nombre: "Tasty 1 (Noroeste)", x: 166, y: 234, detalle: "Junto a Cancha Sintética" },
      { id: "tasty-2", nombre: "Tasty 2 (Oeste)", x: 92, y: 662, detalle: "Entre Canchas Múltiples y Bloque 12" },
      { id: "tasty-3", nombre: "Tasty 3 (Calle U8)", x: 354, y: 728, detalle: "Entre Bloque 09 y Bloque 08" },
      { id: "tasty-4", nombre: "Tasty 4 (Sureste)", x: 652, y: 836, detalle: "Junto a Canchas Múltiples Sureste" }
    ]
  }
];
