import { useState, useEffect, useRef } from "react";
import useQuiosco from "../hooks/useQuiosco"
import clienteAxios from "../config/axios";
import { useNavigate } from "react-router-dom";

export default function NuevaCategoria() {

    const { categorias, obtenerCategorias } = useQuiosco()
    const [nombre, setNombre] = useState("")
    const [icono, setIcono] = useState(null)

    const [cargandoCategoras, setCargandoCategorias] = useState(true)
    const [categoriasLocales, setCategoriasLocales] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef(null)
    

    const cargarCategorias = async() => {
        try {
            setCargandoCategorias(true)
            const token = localStorage.getItem("AUTH_TOKEN")
            const { data } = await clienteAxios('/api/categorias', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            })
            setCategoriasLocales(data.data || data)
            
        } catch (err) {
            console.log("Error al obtener categorias", err)
        }finally{
            setCargandoCategorias(false)
        }
    }
    useEffect(() => {
        cargarCategorias()
    }, [])

    // const navigate = useNavigate()


    // este metodo se active al pulsar el boton guardar 
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!icono) {
            setError("debes insertar un icono SVG o PNG")
            return
        }
        setIsLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("nombre", nombre)
        formData.append("icono", icono)



        try {
            const token = localStorage.getItem("AUTH_TOKEN")

            await clienteAxios.post("/api/categorias", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            setNombre("")

            setIcono(null)

            if (fileInputRef.current) fileInputRef.current.value = ""
            cargarCategorias()
            if (obtenerCategorias) obtenerCategorias()
            // navigate("/admin/productos")


        } catch (error) {
            setError("No se pudo crear el producto, Verifica los datos")
            console.error("Error al crear categoria:", error.response?.data || error.message)

        } finally {
            setIsLoading(false)
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm("Estas seguro que quieres eliminar esta categoria?")) return

        try {
            const token = localStorage.getItem("")
            await clienteAxios.post(`/api/categorias/${id}`,{
                _method: 'DELETE'
            },
                 {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            })
            setCategoriasLocales((prev) => prev.filter((cat) => cat.id !== id))
            if (obtenerCategorias) obtenerCategorias()

        } catch (error) {
            console.error(
                "Error al eliminar categorias",
                error.response?.data || error.message
            )
            alert("Ocurrio un error al intenetar eliminar la categoria-md space-y-8")
        }

    }

    // dentro del return va toda la vista o es lo que entrega la vista
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <div>
                <h1 className="text-2xl font-bold mb-5 text-gray-800">Agregar Nuevo Categoria</h1>
                <form action="space-y-4" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="icono" className="block font-bold">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Ej. Pizzas, Bebidas..."
                            required

                        />
                    </div>



                    <div>
                        <label htmlFor="icono" className="block font-bold">Icono (SVG o PNG):</label>
                        <input
                            type="file"
                            id="icono"
                            ref={fileInputRef}
                            onChange={(e) => setIcono(e.target.files[0])}
                            className="w-full cursor-pointer mt-1"
                            accept=".png,.sgv,image/svg+xml"
                            required
                        />
                    </div>
                    

                    <button
                        type="submit"
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 cursor-pointer"
                        disabled={isLoading}
                    >
                        {/* si el isLoading es true muestra el texto guardando pero si es false muestra el texto guardar productos */}
                        {isLoading ? 'Guardando...' : 'Guardar Categoria'}
                    </button>

                </form>
                {error && <p className="text-red-600">{error}</p>}
            </div>
            <hr className="border-gray-200" />
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Categorias existentes
                </h2>
                {cargandoCategoras ? (
                    <p className="text-gray-500 font-medium animate-pulse">
                        Cargando categorias...
                    </p>
                ) :

                categoriasLocales.length === 0 ? (
                    
                    <p className="text-gray-500 italic">No hay categorias disponibles</p>
                ) : (
                    <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                        {categoriasLocales.map((categoria)=>(
                            <li 
                            key={categoria.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    {categoria.icono && (
                                        <img src={`http://localhost:8000/${categoria.icono}`}
                                        alt={categoria.nombre}
                                        className="w-8 h-8 object-contain"
                                        />
                                    )}
                                    <span className="font-semibold text-gray-700">
                                        {categoria.nombre}
                                    </span>
                                </div>
                                <button
                                onClick={()=>  handleEliminar(categoria.id)}
                                className="bg-red-500 hover:bg-red-700 text-white tesxt-sm font-bold py-1 px-3 rounded transition-colors cursor-pointer"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}