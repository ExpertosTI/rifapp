const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());

// Ensure invoices directory exists
fs.mkdirSync(path.join(__dirname, 'invoices'), { recursive: true });

// Serve static files from current directory (so you can open /raffle.html)
app.use(express.static(path.join(__dirname)));

let count = 123; // starting value for demo

app.get('/api/tickets/count', (req, res) => {
  res.json({ count });
});

app.post('/api/tickets', (req, res) => {
  const payload = req.body || {};

  // Basic validation
  if (!payload.buyer_name || !payload.buyer_email) {
    return res.status(400).json({ success: false, message: 'buyer_name y buyer_email son requeridos' });
  }
  if (payload.payment_method === 'usdt' && !payload.txid) {
    return res.status(400).json({ success: false, message: 'TXID requerido para pagos USDT' });
  }

  const ticket = { id: Date.now(), createdAt: new Date().toISOString(), ...payload };
  count += 1; // increment count on purchase

  // Generate a simple invoice HTML (simulated PDF) and save to /invoices
  const invoiceFilename = `invoice-${ticket.id}.html`;
  const invoicePath = path.join(__dirname, 'invoices', invoiceFilename);
  const invoiceHtml = `<!doctype html>
  <html>
    <head><meta charset="utf-8"><title>Factura ${ticket.id}</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:12px}td,th{padding:8px;border:1px solid #ddd}</style>
    </head>
    <body>
      <h1>Factura - Orden #${ticket.id}</h1>
      <div>Fecha: ${ticket.createdAt}</div>
      <div>Comprador: ${ticket.buyer_name} (${ticket.buyer_email})</div>
      <div>Dirección: ${ticket.buyer_address || '---'}</div>
      <div>NIT / Tax ID: ${ticket.buyer_taxid || '---'}</div>
      <table>
        <tr><th>Descripción</th><th>Cantidad</th><th>Precio</th></tr>
        <tr><td>Boleto de rifa</td><td>1</td><td>$500.00</td></tr>
      </table>
      <div style="margin-top:12px">Método de pago: ${ticket.payment_method}${ticket.txid ? ' (TXID: '+ticket.txid+')' : ''}</div>
      <div style="margin-top:18px;color:#666;font-size:13px">Esta es una factura generada por el sistema de prueba.</div>
    </body>
  </html>`;

  try {
    fs.writeFileSync(invoicePath, invoiceHtml, 'utf8');
  } catch (err) {
    console.error('Error escribiendo factura', err);
  }

  const invoiceUrl = `/invoices/${invoiceFilename}`;

  // Simulate sending email with invoice (in real app you'd use a mail service)
  console.log(`Simulación: factura generada ${invoicePath} y enviada a ${ticket.buyer_email}`);

  res.status(201).json({ success: true, ticket, invoiceUrl });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Mock API & static server running: http://localhost:${port}`));
