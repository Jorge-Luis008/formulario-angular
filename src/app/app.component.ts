import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'formulario-angular';
  nombres = new FormGroup('');
  name01 = new FormControl('');

  submitApplication(name01: string){
    console.log(
      `Names recieved: name01: ${name01}`
    );
  }
}
