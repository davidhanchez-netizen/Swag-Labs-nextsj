export interface Usuario {
  id: string;
  username: string;
  password?: string;
  rol: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
}