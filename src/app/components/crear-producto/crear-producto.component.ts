import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
})
export class CrearProductoComponent {
  productoForm: FormGroup;
  titulo = 'Crear producto';
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductoService,
    private aRouter: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.esEditar();
  }

  agregarProducto() {
    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    };

    if (this.id !== null) {
      //editamos producto
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(
        (data) => {
          this.toastr.info(
            'El producto ' + PRODUCTO.nombre + ' actualizado con exito',
            'Producto actualizado'
          );
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.productoForm.reset();
        }
      );
    } else {
      // agregamos producto

      console.log(PRODUCTO);
      this._productoService.guardarProducto(PRODUCTO).subscribe(
        (data) => {
          this.toastr.success(
            'El producto ' + PRODUCTO.nombre + ' fue registrado con exito',
            'Producto registrado'
          );
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.productoForm.reset();
        }
      );
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe((data) => {
        this.productoForm.setValue({
          producto: data.nombre,
          categoria: data.categoria,
          ubicacion: data.ubicacion,
          precio: data.precio,
        });
      });
    }
  }
}
