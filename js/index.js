import { db } from './firebase.js';
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const map = L.map('map').setView([40.4168, -3.7038], 6);

const markerIcons = {
    red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    yellow: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
};  

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function loadMarkers() {
  const puntosRef = ref(db, 'puntos');
  const snapshot = await get(puntosRef);

  if (snapshot.exists()) {
    const puntos = snapshot.val();
    Object.values(puntos).forEach(data => addMarker(data));
  } 
}

loadMarkers();

var gLatlng;

map.on('click', async function(e) {
    gLatlng = e.latlng;

    // Mostrar el modal de selección de entrenamiento
    var modal = new bootstrap.Modal(document.getElementById('addPointModal'));
    modal.show();

    // Vaciamos los campos del modal
    document.getElementById('title').value = '';
    document.getElementById('difficulty').value = '';
    document.getElementById('image').value = '';
});

// Evento para guardar el punto en la base de datos
document.getElementById('guardarPunto').addEventListener('click', function(event) {

    const { lat, lng } = gLatlng;
    const title = document.getElementById('title').value;
    const difficulty = document.getElementById('difficulty').value;
    const image = document.getElementById('image').value;

    const nuevoPunto = {
        lat,
        lng,
        title,
        difficulty,
        image
    };

    console.log(nuevoPunto);

    // Cerrar el modal
    var modal = bootstrap.Modal.getInstance(document.getElementById('addPointModal'));
    modal.hide();

    if (title && difficulty) {
        const newPointRef = ref(db, 'puntos/' + title);
        set(newPointRef, nuevoPunto);
        addMarker(nuevoPunto);
    }
    
});

function addMarker({ lat, lng, title, difficulty, image, id }) {
    const popupContent = `
    <h3>${title}</h3>
    <button class="btn btn-danger" id="deleteButton">Eliminar</button>
    <a class="btn btn-primary text-light" href="./views/detalle.html?title=${encodeURIComponent(title)}">Ver detalle</a>
  `;


    const customIcon = L.icon({
        iconUrl: markerIcons[difficulty] || markerIcons.blue,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      });
    
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map).bindPopup(popupContent);
  
    // Añadir un evento de clic al botón de eliminación dentro del popup
    marker.on('popupopen', function() {
      const deleteButton = marker.getPopup().getElement().querySelector('#deleteButton');
      
      deleteButton.addEventListener('click', async function() {
        // Eliminar el marcador del mapa
        map.removeLayer(marker);
        
        // Eliminar el punto de la base de datos de Firebase
        const pointRef = ref(db, 'puntos/' + title);  // 'id' es la clave única del punto en la base de datos
        await set(pointRef, null);  // Eliminamos el punto de Firebase
      });
    });
}

let debounceTimer;
const input = document.getElementById('locationInput');
const suggestionsList = document.getElementById('suggestions');

input.addEventListener('input', () => {
  const query = input.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 3) {
    suggestionsList.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(() => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(results => {
        suggestionsList.innerHTML = '';
        results.slice(0, 5).forEach(place => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'list-group-item-action');
          li.textContent = place.display_name;
          li.addEventListener('click', () => {
            map.setView([place.lat, place.lon], 15);
            suggestionsList.innerHTML = '';
            input.value = place.display_name;
          });
          suggestionsList.appendChild(li);
        });
      });
  }, 400);  // Espera 400ms desde la última tecla antes de buscar
});
