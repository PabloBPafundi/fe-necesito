import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, Calendar } from 'lucide-angular';


@Component({
  selector: 'app-product-status',
  imports: [NgClass, LucideAngularModule, NgFor],
  templateUrl: './product-status.component.html',
  styleUrl: './product-status.component.css'
})
export class ProductStatusComponent implements OnInit {
  readonly Calendar = Calendar; 

  ngOnInit(): void {
    console.log(this.getStatusProduct("2025-02-07 00:00", "2025-02-07 10:00"));
  
  }
  
   // Datos de ejemplo para los alquileres
   rentals = [
    {
      title: 'Bicicleta de montaña',
      startDate: "2025-02-15 00:00",  
      endDate: "2025-02-18 00:00",   
    },
    {
      title: 'Cámara fotográfica',
      startDate: "2025-02-09 10:00",  
      endDate: "2025-02-09 22:00",   
    },
    {
      title: 'Proyector 4K',
      startDate: "2025-02-07 00:00",  
      endDate: "2025-02-07 00:00",   
    },
    {
      title: 'Bicicleta de montaña',
      startDate: "2025-02-09 00:00",  
      endDate: "2025-02-14 00:00",   
    },
    {
      title: 'Cámara fotográfica',
      startDate: "2025-02-07 10:00",  
      endDate: "2025-02-12 22:00",   
    },
    {
      title: 'Proyector 4K',
      startDate: "2025-02-01 00:00",  
      endDate: "2025-02-14 00:00",   
    },
    {
      title: 'Bicicleta de montaña',
      startDate: "2025-02-07 00:00",  
      endDate: "2025-02-07 00:00",   
    },
    {
      title: 'Cámara fotográfica',
      startDate: "2025-02-09 10:00",  
      endDate: "2025-02-09 22:00",   
    },
    {
      title: 'Proyector 4K',
      startDate: "2025-02-07 00:00",  
      endDate: "2025-02-07 00:00",   
    },
    {
      title: 'Bicicleta de montaña',
      startDate: "2025-02-07 00:00",  
      endDate: "2025-02-07 00:00",   
    },
    {
      title: 'Cámara fotográfica',
      startDate: "2025-02-09 10:00",  
      endDate: "2025-02-09 22:00",   
    },
    {
      title: 'Proyector 4K',
      startDate: "2025-02-07 00:00",  
      endDate: "2025-02-07 00:00",   
    },
  ];
  
    
    getStatusProduct(startDate: string, endDate: string): string {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
  
  
      //const todayTest = "2025-02-10 09:00"; 
      //const today = new Date(todayTest).getTime();
  
       
      const today = new Date().getTime();
      
  
      if (today < start) return "El período aún no ha comenzado.";
      if (today > end) return "El período ha finalizado.";
     
      if (isNaN(start) || isNaN(end)) {
        throw new Error("Formato de fecha inválido. Usa 'YYYY-MM-DD HH:mm'.");
      }
    
     
      const totalMilliseconds = end - start;
      const totalHours = totalMilliseconds / (1000 * 60 * 60); 
    
     
      const elapsedMilliseconds = today - start;
      const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60); 
    
     
      const percentage = (elapsedHours * 100) / totalHours;
    
      if (percentage >= 95 && percentage < 100 ) {
        return "Estado mayor a 95% - Ultimo minutos";
      } else if (percentage >= 90) {
        return "Estado 90% - Casi finalizado";
      } else if (percentage >= 80) {
        return "Estado 80% - Falta poco";
      } else if (percentage >= 70) {
        return "Estado 70% - Avanzado";
      } else if (percentage >= 60) {
        return "Estado 60% - Más de la mitad";
      } else if (percentage >= 50) {
        return "Estado 50% - Mitad del período";
      } else if (percentage >= 40) {
        return "Estado 40% - Casi la mitad";
      } else if (percentage >= 30) {
        return "Estado 30% - En progreso";
      } else if (percentage >= 20) {
        return "Estado 20% - Falta bastante";
      } else if (percentage >= 10) {
        return "Estado 10% - Recién empieza";
      } else {
        return "Estado 0% - Apenas ha comenzado";
      }
    }

}
