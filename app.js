require('colors');

const { 
    inquirerMenu, 
    pausa, 
    leerInput, 
    listadoTareasBorrar, 
    confirmar, 
    mostrarListadoChecklist 
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');

console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDb = leerDB();

    if( tareasDb ){
        // cargar las tareas
        tareas.cargarTareasFromArr( tareasDb );
    }

    do {
        
        opt = await inquirerMenu();

        switch ( opt ) {
            case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea( desc )
            break;
            case '2':
                tareas.listadoCompleto();
            break;
            case '3': // Listar completadas
                tareas.listarPendientesCompletadas();
            break;
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas( false );
            break;
            case '5': // Completar pendientes
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids )
            break;
            case '6': // Borrar tareas
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if( id !== '0' ){
                    const ok = await confirmar('¿Esta seguro? No se podrá recuperar la tarea') 
                    if( ok ){
                        tareas.borrarTarea( id );
                        console.log( 'Tarea borrada'.green );
                    }
                }
            break;
        }

        guardarDB( tareas.listadoArr );
        
        await pausa();

    } while ( opt !== '0' );

}

main();