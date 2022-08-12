exports.marriageInfo = (data) => {
  console.log(data.brideData.name);
  return `
      <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Person Info</title>
    </head>
    <body>
      <h1>${data.brideData.name}</h1>
    </body>
  </html>
      `;
};
