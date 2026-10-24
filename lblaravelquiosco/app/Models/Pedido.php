<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Pedido extends Model
{
    public function user(){
        return $this->belongsTo(User::class); //relacion  de uno a muchos
    }

    public function productos(){
        return $this->belongsToMany(Producto::class, 'pedido_productos')->withPivot('cantidad');//relacion de muchos a muchos por eso esque agregamos el withpivot porque esta la tabla pivote
    }
}
