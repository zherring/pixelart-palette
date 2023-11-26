// pages/api/colormind.js
export default async function handler(req, res) {
  const url = 'http://colormind.io/api/';
  
  // Make sure you're only accepting POST requests
  if (req.method === 'POST') {
    try {
      // Forward the request to the Colormind API
      const colormindResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      // If the request was successful, send back the Colormind response
      if (colormindResponse.ok) {
        const data = await colormindResponse.json();
        res.status(200).json(data);
      } else {
        // Handle any errors from Colormind
        res.status(colormindResponse.status).json({ message: 'Error fetching palette from Colormind' });
      }
    } catch (error) {
      // Handle any other errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // If it's not a POST request, return a 405 Method Not Allowed
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
