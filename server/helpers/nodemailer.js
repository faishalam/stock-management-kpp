const nodemailer = require("nodemailer");

async function sendEmail(email, data) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formattedPlanRealisasi = formatDate(data.planRealisasi);
  const formattedRealisasiAsset = formatDate(data.realisasiAsset);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "catheringmanagementkpp@gmail.com",
      pass: "rgvm mbhw jqky dicx",
    },
  });
  const sendMail = transporter.sendMail({
    from: "noreply@kpp.com",
    to: `${email}`,
    subject: "📦 Stock Request Needs Your Approval",
    html: `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
      <div style="text-align: left;">
        <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" alt="KPP Logo" style="width: 80px; margin-bottom: 20px;" />
        <h2 style="font-size: 24px; color: #111827; margin: 0 0 10px;">New Stock Request</h2>
        <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Hi Supervisor,</p>
        <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
          Anda memiliki permintaan <strong>stok baru</strong> yang memerlukan persetujuan Anda. Berikut detail permintaannya:
        </p>

        <table width="100%" cellpadding="10" cellspacing="0" style="font-size: 15px; color: #1f2937; background-color: #f9fafb; border-radius: 6px;">
          <tr>
            <td><strong>Request By</strong></td>
            <td>: ${data.User.dataValues.username}</td>
          </tr>
          <tr>
            <td><strong>Nama Material</strong></td>
            <td>: ${data.Material.dataValues.materialName}</td>
          </tr>
          <tr>
            <td><strong>No. Material</strong></td>
            <td>: ${data.Material.dataValues.materialNumber}</td>
          </tr>
          <tr>
            <td><strong>Quantity</strong></td>
            <td>: ${data.quantity} ${data.Material.dataValues.satuan}</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>: ${data.status}</td>
          </tr>
        </table>

        <div style="margin-top: 30px;">
          <a href="https://kpp-asset-management.vercel.app/dashboard"
            style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Review Request
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          Terima kasih,<br/>
          <strong>Managament Cathering KPP</strong>
        </p>
      </div>
    </div>
  `,
  });
  console.log("email berhasil dikirim");
}
async function sendEmailReminderAdmin(email, data) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "catheringmanagementkpp@gmail.com",
      pass: "rgvm mbhw jqky dicx",
    },
  });
  const sendMail = transporter.sendMail({
    from: "noreply@kpp.com",
    to: `${email}`,
    subject: "📦 Notification - Stock Anda Kurang Dari 30%",
    html: `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #e5e7eb;">
      <div style="text-align: left;">
        <img src="https://uccareer.id/assets/upload/company/thumbs/thumb300px-20220214-090222-0fdfc.png" alt="KPP Logo" style="width: 80px; margin-bottom: 20px;" />
        <h2 style="font-size: 24px; color: #111827; margin: 0 0 10px;">New Stock Request</h2>
        <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">Hi Supervisor,</p>
        <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
          Stock Anda <strong>kurand dari 30%</strong> Berikut detail material:
        </p>

        <table width="100%" cellpadding="10" cellspacing="0" style="font-size: 15px; color: #1f2937; background-color: #f9fafb; border-radius: 6px;">
          <tr>
            <td><strong>Nama Material</strong></td>
            <td>: ${data.materialName}</td>
          </tr>
          <tr>
            <td><strong>No. Material</strong></td>
            <td>: ${data.materialNumber}</td>
          </tr>
          <tr>
            <td><strong>Sisa Available Stock</strong></td>
            <td>: ${data.totalStock} ${data.satuan}</td>
          </tr>
        </table>

        <div style="margin-top: 30px;">
          <a href="https://kpp-asset-management.vercel.app/dashboard"
            style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Review Request
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          Terima kasih,<br/>
          <strong>Managament Cathering KPP</strong>
        </p>
      </div>
    </div>
  `,
  });
  console.log("email berhasil dikirim");
}

module.exports = {
  sendEmail,
  sendEmailReminderAdmin,
};
