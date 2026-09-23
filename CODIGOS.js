// 1. Tus credenciales
const supabaseUrl = 'https://pmugozxkgtwgtzlecywg.supabase.co';
const supabaseKey = 'sb_publishable_Ord69_ejm-SgTHGXdNed9w_MD7tvggO';

// 2. Cliente global
let supabaseClient = null;

// 3. Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Supabase al cargar la página
    try {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
            console.log("Supabase listo para usarse");
        } else {
            console.error("La librería de Supabase no se ha cargado en el HTML.");
        }
    } catch (err) {
        console.error("Error al inicializar Supabase:", err);
    }

    // Eventos de los botones
    const btnConectar = document.getElementById('btnConectar');
    if (btnConectar) {
        btnConectar.addEventListener('click', conectarSupabase);
    }

    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarCategoria);
    } else {
        console.error("No se encontró el botón btnBuscar en el HTML");
    }
});

// 4. Función de conexión manual (Opcional)
function conectarSupabase() {
    try {
        if (!supabaseClient) {
            supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        }
        alert("CONEXIÓN EXITOSA");
        console.log("Cliente Supabase inicializado:", supabaseClient);
    } catch (error) {
        alert("ERROR DE CONEXIÓN");
        console.error("Detalles del error:", error);
    }
} // <-- AQUÍ FALTABA ESTA LLAVE DE CIERRE

// 5. Función para buscar categoría
async function buscarCategoria() {
    if (!supabaseClient) {
        alert("El cliente de Supabase no está listo 🔌");
        return;
    }

    const id = document.getElementById('id_categoria').value.trim();
    const nombre = document.getElementById('nombre_categoria').value.trim();

    if (!id && !nombre) {
        alert("Ingresa un ID o un Nombre para buscar ⚠️");
        return;
    }

    try {
        let query = supabaseClient.from('categorias').select('*');

        if (id) {
            query = query.eq('id_categoria', id);
        }
        if (nombre) {
            query = query.ilike('nombre', `%${nombre}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("No se encontró ninguna categoría ❌");
            return;
        }

        // Mostrar resultados en los inputs
        document.getElementById('id_categoria').value = data[0].id_categoria ?? '';
        document.getElementById('nombre_categoria').value = data[0].nombre ?? '';
        document.getElementById('estado').value = data[0].estado ?? '';

        alert(`✅ Se encontraron ${data.length} resultado(s).`);

    } catch (error) {
        alert("Error al buscar ❌: " + error.message);
        console.error("Detalle del error:", error);
    }
}
