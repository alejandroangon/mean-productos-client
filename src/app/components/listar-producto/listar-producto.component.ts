import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-producto',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './listar-producto.component.html',
  styleUrl: './listar-producto.component.css',
})
export class ListarProductoComponent {
  listProductos: Producto[] = []
  constructor(private _productoService: ProductoService, private toastr: ToastrService) {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this._productoService.getProductos().subscribe(
      (data) => {
        console.log(data);
        console.log('Apagalo Otto, Apagaloo');
        this.listProductos = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminarProducto(id:any){
    this._productoService.eliminarProducto(id).subscribe(data =>{
      this. toastr.error('El producto fue eliminado correctamente', 'Producto eliminado');
      this.obtenerProductos();
    }, error => {
      console.log(error);
    })
  }
}
