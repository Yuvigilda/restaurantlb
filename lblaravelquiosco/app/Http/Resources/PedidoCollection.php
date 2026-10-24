<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PedidoCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */

    //esta collection retorna lo que tenemos en la bd pero al momento de que realizamos el pedido 
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
