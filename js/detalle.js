import { db } from './firebase.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Obtener el parámetro `title` de la URL
const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');

if (!title) {
  document.getElementById('titulo').textContent = 'Punto no encontrado.';
} else {
  const pointRef = ref(db, 'puntos/' + title);
  get(pointRef).then(snapshot => {
    if (snapshot.exists()) {
      const punto = snapshot.val();

      document.getElementById('titulo').textContent = punto.title;
      const restaurantes = punto.restaurantes || [];
      const lugares = punto.lugaresParaVisitar || [];

      document.getElementById('restaurantes').value = restaurantes.join(', ');
      document.getElementById('lugares').value = lugares.join(', ');

      // Mostrar listas visuales
      document.getElementById('restaurantesLista').innerHTML = generarListaHTML(punto.restaurantes || []);
      document.getElementById('lugaresLista').innerHTML = generarListaHTML(punto.lugaresParaVisitar || []);
      

      document.getElementById('notas').value = punto.notas || '';


      if (punto.image) {
        const imagen = document.getElementById('imagen');
        imagen.src = punto.image;
        imagen.style.display = 'block';
      }
    } else {
      document.getElementById('titulo').textContent = 'Punto no encontrado en la base de datos.';
    }
  }).catch(error => {
    console.error(error);
    document.getElementById('titulo').textContent = 'Error al cargar el punto.';
  });
}

document.getElementById('guardarDetalle').addEventListener('click', async () => {
    const restaurantes = document.getElementById('restaurantes').value.split(',').map(x => x.trim()).filter(Boolean);
    const lugares = document.getElementById('lugares').value.split(',').map(x => x.trim()).filter(Boolean);
    const notas = document.getElementById('notas').value;
  
    const updates = {
      restaurantes,
      lugaresParaVisitar: lugares,
      notas
    };
  
    try {
      const pointRef = ref(db, 'puntos/' + title);
      await update(pointRef, updates);

      document.getElementById('restaurantesLista').innerHTML = generarListaHTML(restaurantes);
      document.getElementById('lugaresLista').innerHTML = generarListaHTML(lugares);

    } catch (error) {
      console.error(error);
    }
});

function generarListaHTML(items) {
    if (items.length === 0) return '<p class="text-muted">Sin información.</p>';
    return `
      <ul class="list-group">
        ${items.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${item}</span>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item + ' ' + title)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-sm btn-success"
              title="Buscar en Google Maps"
            >
              Ver en Maps
            </a>
          </li>
        `).join('')}
      </ul>
    `;
}
  

// Al darle al logo de la app, redirigir a la página principal
document.getElementById('logo').addEventListener('click', () => {
    window.location.href = '../index.html';
});
  
  
  
