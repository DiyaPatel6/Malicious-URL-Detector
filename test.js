const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-apikey': '4a53869353ea8ff16732e630931d623415677a75f4e43c7677c371789c248aad'
  }
};

fetch('https://www.virustotal.com/api/v3/urls/google.com', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));