let movies = [];

// Función para obtener las películas
async function fetchMovies() {
  try {
    const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    movies = await response.json();
  } catch (error) {
    console.error('Error al obtener las películas:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchMovies);

// Función para mostrar las películas filtradas
function mostrarPeliculas(peliculasFiltradas) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiar la lista

  peliculasFiltradas.forEach(pelicula => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.innerHTML = `
      <h4>${pelicula.title}</h4>
      <p>${pelicula.tagline || 'Sin tagline disponible'}</p>
      <p>Rating: ${convertirAEstrellas(pelicula.vote_average)}</p>
    `;

    item.addEventListener('click', function() {
      mostrarDetallesPelicula(pelicula);
    });

    lista.appendChild(item);
  });
}

function convertirAEstrellas(rating) {
  let stars = "";
  const estrellasLlenas = parseInt(rating / 2);
  const estrellasMitad = (rating / 2) % 1 !== 0;
  const estrellasVacias = 5 - estrellasLlenas - (estrellasMitad ? 1 : 0);

  for (let i = 0; i < estrellasLlenas; i++) {
    stars += `<span class="fa fa-star checked"></span>`;
  }
  if (estrellasMitad) {
    stars += `<span class="fa fa-star-half-alt checked"></span>`;
  }
  for (let i = 0; i < estrellasVacias; i++) {
    stars += `<span class="fa fa-star"></span>`;
  }
  return stars;
}

function buscarPeliculas() {
  const inputBuscar = document.getElementById('inputBuscar').value.toLowerCase().trim();

  if (inputBuscar !== '') {
    const peliculasFiltradas = movies.filter(pelicula => {
      return (
        pelicula.title.toLowerCase().includes(inputBuscar) ||
        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
        pelicula.overview.toLowerCase().includes(inputBuscar) ||
        pelicula.genres.some(genre => genre.name.toLowerCase().includes(inputBuscar))
      );
    });

    if (peliculasFiltradas.length > 0) {
      mostrarPeliculas(peliculasFiltradas);
    } else {
      document.getElementById('lista').innerHTML = '<li class="list-group-item">No se encontraron coincidencias</li>';
    }
  } else {
    document.getElementById('lista').innerHTML = '<li class="list-group-item">Por favor, ingresa un término de búsqueda</li>';
  }
}

function mostrarDetallesPelicula(pelicula) {
  const titulo = document.getElementById('detalleTitulo');
  const overview = document.getElementById('detalleOverview');
  const generos = document.getElementById('detalleGeneros');

  titulo.textContent = pelicula.title;
  overview.textContent = pelicula.overview || 'Descripción no disponible';

  generos.innerHTML = '';
  pelicula.genres.forEach(genre => {
    const generoItem = document.createElement('li');
    generoItem.textContent = genre.name;
    generos.appendChild(generoItem);
  });

  document.getElementById('movieYear').textContent = pelicula.release_date.split('-')[0];
  document.getElementById('movieRuntime').textContent = pelicula.runtime || 'N/A';
  document.getElementById('movieBudget').textContent = pelicula.budget ? pelicula.budget.toLocaleString() : 'N/A';
  document.getElementById('movieRevenue').textContent = pelicula.revenue ? pelicula.revenue.toLocaleString() : 'N/A';

  const offcanvas = new bootstrap.Offcanvas(document.getElementById('detallesPelicula'));
  offcanvas.show();
}

document.getElementById('inputBuscar').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    buscarPeliculas();
  }
});

document.getElementById('btnBuscar').addEventListener('click', buscarPeliculas);



