<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaCollection;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CategoriaController extends Controller
{
    public function index()
    {
        return new CategoriaCollection(Categoria::all());
    }
    public function store (Request $request){
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            
            'icono' => 'nullable|file|mimes:,png|max:2048',
            
        ]);
        if($request->hasFile('icono')){
            $file = $request->file('icono');
            $extension = $file->getClientOriginalExtension();
            $filename= Str::slug($request->nombre) .'-' . time()  . '.' . $extension;
            $file->move(public_path('img'), $filename);
            //$path = $request->file('imagen')->store('productos', 'public');
            $validated['icono'] = 'img/' . $filename;
        }

        //validate toma todo lo que esta en el validate de la linea 25 y ese validate toma todo lo que esta en el request
        $categoria = Categoria::create($validated);

        return response()->json($categoria,201);
    }

    public function destroy($id){
        $categoria =  Categoria::find($id);
        if(!$categoria){
        return response()->json(['message' => 'Categoria no encontra'],404);
        }

        if($categoria->icono && File::exists(public_path($categoria->icono))){
            File::delete(public_path($categoria->icono));
            }
    
    
    $categoria->delete();

    return response()->json(['message' => 'Categoria eliminada correctamente'],200);
}

}