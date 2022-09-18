const us = document.getElementById('us');
const ps = document.getElementById('ps');
const sub = document.getElementById('sub');

sub.addEventListener('click', async () => {
  const result = await fetch(
    // "https://cspace-api.herokuapp.com/api/v1/users/login",
    '/api/v1/users/login',
    {
      //   const result = await fetch("/api/v1/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        credentials: 'include',
      },
      body: JSON.stringify({
        loginId: '123456',
        password: 'pass12345',
      }),
    },
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .then((res) => {
      //If credentials are correct
      if (res.status === 'success') {
        console.log(res);
      }
    });
});
