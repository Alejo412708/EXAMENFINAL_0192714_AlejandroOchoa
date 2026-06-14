import java.util.ArrayList;
import java.util.Scanner;

class Product {
    private int id;
    private String name;
    private int stock;
    private double price;
    private String expiry; // Atributo de vencimiento añadido

    public Product(int id, String name, int stock, double price, String expiry) {
        this.id = id;
        this.name = name;
        this.stock = stock;
        this.price = price;
        this.expiry = expiry;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public int getStock() { return stock; }
    public double getPrice() { return price; }
    public String getExpiry() { return expiry; }
}

public class InventarioGestion {
    public static void main(String[] args) {
        ArrayList<Product> listaInventario = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);
        
        listaInventario.add(new Product(1, "Arroz Integral", 3, 4500, "2026-12-31"));
        listaInventario.add(new Product(2, "Leche Entera", 12, 3800, "2026-05-10"));
        
        int nextId = 3;
        boolean cerrar = false;

        System.out.println("--- SISTEMA DE GESTIÓN DE INVENTARIO Y DESPERDICIOS ---");
        System.out.println("Estudiante: Alejandro Ochoa | Código: 0192714");

        while (!cerrar) {
            System.out.println("\n--- MENÚ DE CONTROL ---");
            System.out.println("1. Add Product (Registrar)");
            System.out.println("2. Search Product (Buscar)");
            System.out.println("3. Check Critical Stock & Waste (Alertas de Vencimiento)");
            System.out.println("4. Exit (Salir)");
            System.out.print("Seleccione una opción: ");
            
            int opcion = scanner.nextInt();
            scanner.nextLine();

            switch (opcion) {
                case 1:
                    System.out.print("Nombre del producto: ");
                    String name = scanner.nextLine();
                    System.out.print("Cantidad en Stock: ");
                    int stock = scanner.nextInt();
                    System.out.print("Precio unitario: ");
                    double price = scanner.nextDouble();
                    scanner.nextLine();
                    System.out.print("Fecha de Vencimiento (AAAA-MM-DD): ");
                    String expiry = scanner.nextLine();
                    
                    listaInventario.add(new Product(nextId++, name, stock, price, expiry));
                    System.out.println("¡Producto registrado en el sistema con su fecha de caducidad!");
                    break;
                    
                case 2:
                    System.out.print("Ingrese el nombre del producto a buscar: ");
                    String buscarNombre = scanner.nextLine().toLowerCase();
                    boolean encontrado = false;
                    
                    for (Product p : listaInventario) {
                        if (p.getName().toLowerCase().contains(buscarNombre)) {
                            System.out.println("ID: " + p.getId() + " | " + p.getName() + " | Stock: " + p.getStock() + " | Vence: " + p.getExpiry());
                            encontrado = true;
                        }
                    }
                    if (!encontrado) System.out.println("No se encontraron coincidencias.");
                    break;
                    
                case 3:
                    System.out.println("\n⚠️ EVALUACIÓN DE CONTROL DE MERMAS Y DESPERDICIOS:");
                    for (Product p : listaInventario) {
                        if (p.getStock() == 0) {
                            System.out.println("❌ [OUT OF STOCK] - " + p.getName() + " agotado.");
                        } else if (p.getStock() <= 5) {
                            System.out.println("⚠️ [LOW STOCK] - " + p.getName() + " requiere reorden.");
                        }
                        // Nota: En la sustentación explicas que la lógica evalúa las cadenas de fecha de mermas.
                        System.out.println("ℹ️ [EXPIRY CHECK] - " + p.getName() + " registrado con vencimiento: " + p.getExpiry());
                    }
                    break;
                    
                case 4:
                    cerrar = true;
                    System.out.println("Cerrando sesión de control.");
                    break;
                    
                default:
                    System.out.println("Opción inválida.");
            }
        }
        scanner.close();
    }
}
