// CÓDIGO PARA GOOGLE APPS SCRIPT
// Este código debe ir en tu Google Sheet en Extensiones > Apps Script

function doPost(e) {
  try {
    // Obtener la hoja activa (o crea una nueva si no existe)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Jugadores');
    
    // Si la hoja no existe, créala
    if (!sheet) {
      sheet = ss.insertSheet('Jugadores');
      
      // Crear encabezados
      const headers = [
        'Fecha Registro',
        'Nombre',
        'Teléfono',
        'Género',
        'Posición',
        'Categoría',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatear encabezados
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#00ff00')
        .setFontColor('#000000')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      
      // Ajustar ancho de columnas
      sheet.setColumnWidth(1, 150); // Fecha
      sheet.setColumnWidth(2, 200); // Nombre
      sheet.setColumnWidth(3, 120); // Teléfono
      sheet.setColumnWidth(4, 150); // Posición
      for (let i = 5; i <= 10; i++) {
        sheet.setColumnWidth(i, 150); // Días
      }
    }
    
    // Parsear los datos recibidos
    const datos = JSON.parse(e.postData.contents);
    
    // Preparar la fila con los datos
    const fila = [
      datos.fecha,
      datos.nombre,
      datos.telefono,
      datos.genero,
      datos.posicion,
      datos.categoria,
      datos.disponibilidad.lunes || 'No disponible',
      datos.disponibilidad.martes || 'No disponible',
      datos.disponibilidad.miercoles || 'No disponible',
      datos.disponibilidad.jueves || 'No disponible',
      datos.disponibilidad.viernes || 'No disponible',
      datos.disponibilidad.sabado || 'No disponible'
    ];
    
    // Agregar la fila al final
    sheet.appendRow(fila);
    
    // Formatear la fila agregada
    const ultimaFila = sheet.getLastRow();
    sheet.getRange(ultimaFila, 1, 1, fila.length)
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');
    
    // Alternar colores de filas para mejor legibilidad
    if (ultimaFila % 2 === 0) {
      sheet.getRange(ultimaFila, 1, 1, fila.length).setBackground('#f0f0f0');
    }
    
    // Respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Datos guardados correctamente'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Respuesta de error
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba (opcional, para verificar que funciona)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        fecha: new Date().toLocaleString('es-AR'),
        nombre: 'Juan Test',
        telefono: '1123456789',
        genero: 'Caballero',
        posicion: 'Drive',
        categoria: '5ta',
        disponibilidad: {
          lunes: '16:30, 18:00',
          martes: '19:30',
          miercoles: 'No disponible',
          jueves: '18:00, 21:00',
          viernes: '16:30, 19:30, 21:00',
          sabado: '18:00'
        }
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
