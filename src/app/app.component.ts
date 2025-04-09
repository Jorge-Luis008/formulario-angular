import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  title = 'formulario-angular';
  nombres = new FormGroup('');
  name01 = new FormControl('');

  async loadData(){
    const apiStatesURL = 'https://sepomex.icalialabs.com/api/v1/states?per_page=32';
    //Declaraciones a cambiar
    let a = 0;
    var dataStates= [0];
    var statesPageLength = 0;

    const giveState = await fetch(apiStatesURL).then(response => response.json()).then(data => {
      dataStates = data;
      statesPageLength = data.states.lenght;
    })

    while(a < statesPageLength){
      if(a == statesPageLength){break;}
      var addState = new Option(dataStates.states[a].name, a);
      stateList.options.add(addState);
      a++;
    }
  }
  async giveMunicipality(){
    municipalityList.disabled = stateList.value=="";
    var selectState = stateInput.selectedIndex + 1;

    if(!stateList.value){
      return;
    } else {
      var url1 = String(['https://sepomex.icalialabs.com/api/v1/states'+selectState+'/municipalities']);
      var totalMuni = 0;
      var data1 = 0;

      //Busca los municipios por el estado seleccionado
      const resMuni = await fetch(url1)
      .then(response => response.json())
      .then(data => {
        data1 = data
        totalMuni = data.municipalities.lenght
      });

      while(municipalityList.options.length){//Elimina los municipios que estaban antes, si habia algunos
        municipalityList.remove(0);
      }
      if(totalMuni){ //Añade todos los municipios del estado seleccionado
        for(var i = 0; i <= totalMuni-1; i++){
          var muni2 = new Option(data1.municipalities[i].name, i);
          municipalityList.options.add(muni2);
        }
      }
    }
  }
  async submitApplication(){
    var stateNum = stateInput.value;
    var muniNum = municipalityInput.value;

    //BUSCAR EL NOMBRE DEL ESTADO
    var data2 = 0;
    var stateLength = 0;
    var url2 = String(['https://sepomex.icalialabs.com/api/v1/states?per_page=32']);
    var idStart = 0;

    //Obtener el numero de estados en la pagina
    const stateName = await fetch(url2).then(response => response.json()).then(data => {
      data2 = data;
      stateLength = data.states.length;
    })

    //Buscar el estado correcto y su nombre
    let x = 0;
    while(x < stateLength){
      if (String(idStart) == stateNum){
        var state2 = data2.states[x].name;
        break;
      }
      x = x + 1;
      idStart = idStart + 1;
    }

    //BUSCAR EL NOMBRE DEL MUNICIPIO
    var data3 = 0;
    var muniLength = 0;
    var idBegin = 0;

    //Buscar la pagina del estado con sus municipios
    var selState2 = stateList.value;
    const url3 = String(['https://sepomex.icalialabs.com/api/v1/states/'+selState2+'/municipalities']);

    //Obtener el numero de municipios de la pagina
    const muniNumb = await fetch(url3).then(response2 => response2.json()).then(data => {
      data3 = data;
      muniLength = data.municipalities.length;
    })

    //Funcion para buscar el municipio correcto y su nombre
    let y = 0;
    while (y < muniLength){
      if (String(idBegin) == muniNum){
        var muni2 = data3.municipalities[y].name;
        break;
      }
      y = y + 1;
      idBegin = idBegin + 1;
    }

    //VALIDACION
    if (this.validarCampos()){
      var selectState = stateInput.selectedIndex;
      var selectMuni = municipalityInput.selectedIndex;
      var sendState = stateInput[selectState].text;
      var sendMuni = municipalityInput[selectMuni].text;
      var selGender = this.checkGender;
      var eduValues = this.getEducation;

      //Llamar la funcion para dar genero/sexo
      this.checkGender();
      //Llamar la funcion para dar la educacion
      this.getEducation();

      const bodyRequest = {
        nombre: nameInput1.value,
        apellidoPaterno: nameInput2.value,
        apellidoMaterno: nameInput3.value,
        calle: streetInput.value,
        codigoPostal: zipCodeInput.value,
        estado: sendState,
        municipio: sendMuni,
        sexo: selGender,
        educacion: eduValues
      }
      /*
      const url2 = "https://postman-echo.com/post";
      var requestOptions = {
        method:'POST',
        mode: 'cors',
        body: JSON.stringify(bodyRequest),
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      };

      //fetch para enviar datos a postman-echo y los regrese la consola
      try{
        const respuesta = await fetch(url2, requestOptions);
        if (!respuesta.ok){
          throw new Error (`Response status: ${respuesta.status}`);
        }
        const json = await respuesta.json();
        console.log(json);
        alert("Informacion enviada");
      } catch(error){
        console.error(error.message);
        alert("Hubo un ERROR, informacion NO enviada. Intentalo mas tarde.")
      }
      */
     console.log(bodyRequest);
    } else {
      //Otro Failsafe
      alert("ERROR: Verifica que rellenaste todos los campos e intentalo otra vez");
      return;
    }
  }
  validarCampos(){
    if (!nameInput1 || !nameInput2 || !nameInput3 || !streetInput || !zipCodeInput || !stateInput || !municipalityInput){
      return false;
    }
    return true;
  }

  //Funcion para limpiar lo escrito en el formulario
  clearImput(){
    //Datos necesarios
    nameInput1.value='';
    nameInput2.value='';
    nameInput3.value='';
    streetInput.value='';
    stateInput.value='';
    municipalityInput.value='';
    phoneInput.value='';
    //Datos opcionales
    genderInput0.checked = true;
    genderInput1.checked = false;
    genderInput2.checked = false;
    eduInput0.checked = false;
    eduInput1.checked = false;
    eduInput2.checked = false;
  }

  //Funcion para validar el numero de telefono y prevenir elementos no deseados(letras y simbolos)
  validatePhoneNumber(event:any){
    if(isNaN(event.key) && event.key !== 'Backspace'){
      event.preventDefault();
    }
  }

  checkGender(){
    var selGender = '';
    const genderSel = document.querySelector('input[name="genero"]:checked');
    if (genderSel){
      selGender = genderSel.value;
    } else {
      selGender = '??????';
    }
    return selGender;
  }

  getEducation(){
    var eduValues = '';
    //Busca el fieldset con id "education"
    const fieldEdu = document.getElementById('education');

    //Selecciona todos los campos dentro de "education"
    const checkEdu = fieldEdu?.querySelectorAll('input[type="checkbox"]');

    //Se filtra y mapea los valores
    const selecValor = Array.from(checkEdu)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

    //Si no se da ningun nivel de educacion
    eduValues = selecValor.length > 0 ? selecValor : 'Educacion no seleccionada';

    //Se regresa el resultado
    return eduValues;
  }
}

//Declaraciones
  // Campos necesarios
const nameInput1 = <HTMLInputElement>document.getElementById("name");
const nameInput2 = <HTMLInputElement>document.getElementById("name2");
const nameInput3 = <HTMLInputElement>document.getElementById("name3");
const streetInput = <HTMLInputElement>document.getElementById("street");
const zipCodeInput = <HTMLInputElement>document.getElementById("zipCode");
const stateInput = <HTMLInputElement>document.getElementById("state");
const municipalityInput = <HTMLInputElement>document.getElementById("municipality");
const phoneInput = <HTMLInputElement>document.getElementById("phone");
  // Campos Opcionales
const genderInput0 = document.getElementById("genderMale");
const genderInput1 = document.getElementById("genderFemale");
const genderInput2 = document.getElementById("genderOther");

const eduInput0 = document.getElementById("eduSecundaria");
const eduInput1 = document.getElementById("eduPrepa");
const eduInput2 = document.getElementById("eduUni");
  // Boton
const checkButton1 = document.getElementById("sendForm");

var stateList = document.getElementById("state");
var municipalityList = document.getElementById("municipality");

