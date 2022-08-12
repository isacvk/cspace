exports.generalInfo = (data) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Person Info</title>
  </head>
  <body>
    <h1>${data.firstName}</h1>
  </body>
</html>
    `;
};

exports.marriageInfo = (data) => {
  console.log(data.brideData.name);
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>General Info</title>
    <style>
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Sackers Gothic Std';
      font-weight: 500;
      font-size: 12px;
      webkit-print-color-adjust: exact;
      box-sizing: border-box;
    }
    .container{
      width:180mm;
      height:297mm;
      background-color:#eee;
      display: block;
      page-break-after: auto;
      padding:20px 40px;
    }
    
    .letter-head{
      text-align:center;
      border-bottom: 2px solid black;
    }
    .message{
      width:190mm;
      margin:0 auto;
    }
    .message p{
      width:150mm;
  }
    
    .dig-sign{
      width:190mm;
    }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="letter-head">
        <h2 class="heading">St. Thomas Church, Gandibagilu</h2>
        <h4>Neriya Village, Belthangady, D.K - 574228</h4>
      </div>
      <div class="main-content">
        <h3 class="name">${data.brideGroomData.name}</h3>
        <p class="message">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel illum, consequuntur porro dolores facere omnis sed? Molestiae expedita qui quas? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis commodi at magni nostrum ducimus, eius laudantium illo itaque. Natus consequuntur nesciunt officiis illum harum quidem, quaerat necessitatibus odio modi at?</p>
        <div class="dig-sign">
          <h3 >SIGN : </h3>
          <p class="sign">${data.signature}</p>
        </div>
      </div>
     </div>
  </body>
  </html>`;
};
