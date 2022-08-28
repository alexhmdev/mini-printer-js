const escpos = require('escpos');
const path = require('path');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: 'GB18030' /* default */ };
// encoding is optional

const printer = new escpos.Printer(device);

const logo = path.join(__dirname, 'assets/EKDTBW2.1.png');
const arrTicketJson = [
  {
    producto: 'Bolillo',
    total: '$1.00',
    cantidad: '1',
  },
  {
    producto: 'Concha',
    total: '$1.00',
    cantidad: '1',
  },
  {
    producto: 'Muffin chocolate',
    total: '$1.00',
    cantidad: '1',
  },
  {
    producto: 'Pastel de chocolate',
    total: '$111,111.00',
    cantidad: '1111',
  },
  {
    producto: 'Pastel de zanahoria',
    total: '$1,500.00',
    cantidad: '45',
  },
];
escpos.Image.load(logo, function (image) {
  device.open(function () {
    printer
      .font('a')
      .align('ct')
      .image(image, 'S24')

      .then(() => {
        printer
          .text('--------------------------------')
          .align('lt')
          .text(
            'Fecha: ' +
              new Date().toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
          )
          .text(
            'Hora: ' +
              new Date().toLocaleString('es-MX', {
                hour: 'numeric',
                minute: 'numeric',
              })
          )
          .tableCustom([
            { text: 'Producto', align: 'LEFT', width: 0.3 },
            { text: 'Total', align: 'LEFT', width: 0.3 },
            { text: 'Cant', align: 'LEFT', width: 0.3 },
          ])
          .text('--------------------------------');
        for (let i = 0; i < arrTicketJson.length; i++) {
          printer.tableCustom([
            { text: arrTicketJson[i].producto, align: 'LEFT', width: 0.3 },
            { text: arrTicketJson[i].total, align: 'LEFT', width: 0.3 },
            { text: arrTicketJson[i].cantidad, align: 'LEFT', width: 0.3 },
          ]);
        }
        printer.cut().close();
      });

    // OR non-async .raster(image, "mode") : printer.text("text").raster(image).cut().close();
  });
});
// device.open(function (error) {
//   const arrTicketJson = [
//     {
//       producto: 'Bolillo',
//       total: '$1.00',
//       cantidad: '1',
//     },
//     {
//       producto: 'Concha',
//       total: '$1.00',
//       cantidad: '1',
//     },
//     {
//       producto: 'Muffin chocolate',
//       total: '$1.00',
//       cantidad: '1',
//     },
//     {
//       producto: 'Pastel de chocolate',
//       total: '$111,111.00',
//       cantidad: '1111',
//     },
//     {
//       producto: 'Pastel de zanahoria',
//       total: '$1,500.00',
//       cantidad: '45',
//     },
//   ];

// });
