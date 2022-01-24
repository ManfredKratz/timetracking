const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt =  require('jsonwebtoken');

//Importieren aller ausgelagerten Modulen
const service_technician = require('./modules/service_technician_sql');
const project_status = require('./modules/project_status_sql');
const customer = require('./modules/customer_sql');
const project = require('./modules/project_sql');
const service = require('./modules/service_sql');
const service_ispaid = require('./modules/service_ispaid_sql');

secretkey = "secretkey"

app.use(bodyParser.json(), cors());


/**
 * TRY AND CATCH -> sonst gibt es Fehlermeldungen mit Promise!
 * Alle Ergebnisse werden über HTTP-Statuscodes an den Client gesendet
 */


/**
 * Routen zu Projekten
 * 
 * Daten werden übergeben und ein Projektstatus wird erstellt
 */
app.post('/createprojectstatus', async (req, res, next) => {
    try {
        await project_status.create_project_status(req.body);
        res.status(200).send();
    }
    catch (err) {
        next(err)
    }
});
app.get('/getallprojectstatus', async (req, res, next) => {
    try {
        res.send(await project_status.get_all_project_status());
    } catch (err) {
        next(err)
    }
});
/**
 * Gibt den Status zu einem Projekt zurück
 * Zuvor wird überprüft, ob das Projekt mit der angefragten ID existiert
 */
app.get('/getprojectstatus/:project_id', async (req,res,next) =>{
    try{
        const exists = await project.bool_exist_project(req.params.project_id);
        if(exists == undefined){
            res.status(404).send({error: `Project with ID ${req.params.project_id} not found`})
        } else{
            status = await project_status.get_project_status(req.params.project_id);
            res.status(200).send(status);
        }

    }catch (err) {
        next(err)
    }
})

/**
 * Ein Bezahlstatus wird mit den übergebenen Daten erstellt
 */
app.post('/createserviceispaid', async (req, res, next) => {
    try {
        await service_ispaid.create_service_ispaid(req.body);
        res.status(200).send();
    }
    catch (err) {
        next(err)
    }
});
/**
 * Alle Daten zu den Bezahlstatus wird abgefragt
 */
app.get('/getallserviceispaid', async (req, res, next) => {
    try {
        res.send(await service_ispaid.get_all_service_ispaid());
    } catch (err) {
        next(err)
    }
});
/**
 * Der Bezahlstatus zu einem abgefragten Einsatz_id wird zurückgegeben
 * Zuvor wird überprüft, ob der Einsatz existiert
 */
app.get('/getserviceispaid/:service_id', async (req,res,next) =>{
    try{
        const exists = await project.bool_exist_project(req.params.service_id);
        if(exists == undefined){
            res.status(404).send({error: `Service with ID ${req.params.service_id} not found`})
        } else{
            status = await service_ispaid.get_service_ispaid(req.params.service_id);
            res.status(200).send(status);
        }

    }catch (err) {
        next(err)
    }
})

/**
 * Routen zu SERVICE TECHNIKER
 * Alle Daten zu den Service Technikern wird abgefragt
 */
app.get('/getallservicetechnician', async (req, res, next) => {
    try{
        data_service_technician = await service_technician.get_all_service_technician()
        res.status(200).send(data_service_technician);
    } catch (err){
            next(err)
    }
});
/**
 * Route zum Registrieren eines Service Technikers
 * Es wird überprüft, ob bereits ein Account zu der angegebenen E-Mail existiert
 */
app.post('/signup', async (req, res, next) => {
    try {
        const existsemail = await service_technician.find_service_technician_email(req.body);
        if(existsemail == undefined){
            service_technician.create_service_technician(req.body);
            res.status(204).send();
        }else{
            res.status(400).send();
        }

    } catch (err) {
        next(err)
    }
});
/**
 * Ein Service Techniker wird mittels seiner ID gesucht
 * Falls es diesen nicht gibt wird eine Fehlermeldung ausgegeben
 * Sonst werden Daten zu angefragter ID zurückgegeben
 */
app.get('/findservicetechnicianbyid/:personal_id', async (req, res, next) => {
    try {
        const worker = await service_technician.find_service_technician_by_id(req.params.personal_id);
        if (worker == undefined) {
            res.status(404).send(`Worker ${req.params.personal_id} not found`);
        } else {
            res.status(201).send(worker)
        }
    } catch (err) {
        next(err)
    }
});

/**
 * Login für die Service Techniker
 * Zuerst wird überprüft ob das password zu der eingegebenen Email gehört
 * User Daten werden in den Token mitgegeben -> JSONWEBTOKEN
 */
app.post('/login', async (req, res, next) => {
    try{
        const hashpwd = await service_technician.get_pwd_service_technician(req.body);
        if (hashpwd == true){
            const service_technician_information = await service_technician.get_data_service_technician(req.body)
            token = jwt.sign({service_technician_information}, secretkey);
            res.status(200).json({
                title: 'login success',
                token: token
            })
        }else{
            res.status(400).send("Login Fehlgeschlagen")
        }
    }catch(err){
        next(err)
    }
});
/**
 * Route gibt alle Einsätze eines Service Technikers (ID) zurück
 */
app.get('/getservicetechnicianservice/:personal_id', async (req, res, next) => {
    try{
        servicedata_service_technician = await service_technician.get_service_technician_service(req.params.personal_id)
        res.status(200).send(servicedata_service_technician);
    } catch (err){
            next(err)
    }
});

/**
 * Route gibt alle Projekte eines Service Technikers (ID) zurück
 */
app.get('/getservicetechnicianproject/:personal_id', async (req, res, next) => {
    try{
        projectdata_service_technician = await service_technician.get_service_technician_project(req.params.personal_id)
        res.status(200).send(projectdata_service_technician);
    } catch (err){
            next(err)
    }
});
/**
 * JsonWebToken wird aus dem LocalStorage des Browsers gelesen und decoded übergeben
 */
app.get('/getservicetechniciandata', async (req, res, next) => {
    token = req.headers.token
    jwt.verify(token, secretkey, (err, decoded) => {
        if (err){
            res.status(401).send(err)
        } else {
            res.status(200).send(decoded.service_technician_information)
        }
    })
})
/**
 * Es wird abgefragt, ob Service Techniker mit ID existiert
 * Ergebnis wird als TRUE oder FALSE interpretiert und an den Nutzer gesendet
 */
app.get('/existservice_technician/:id', async (req, res, next) => {
    try {
        const exists = await service_technician.bool_exist_service_technician(req.params.id);
        if(exists != undefined){
            res.status(200).send(true);
        }else{
            res.status(404).send(false);
        }
            
    }catch(err){
        next(err)
    }
});


/**
 * Routen zu Kunden
 * 
 * Gibt alle Kunden zurück
 */
app.get('/getallcustomer', async (req, res, next) => {
    try {
        res.send(await customer.get_all_customer());
    } catch (err) {
        next(err)
    }
});
/**
 * Daten werden übergeben und ein Kunde wird erstellt
 */
app.post('/createcustomer', async (req, res, next) => {
    try {
        await customer.create_customer(req.body);
        res.status(204).send()
    } catch (err) {
        next(err)
    }
});
/**
 * Kunde wird anhand von seiner ID gesucht
 * Falls es diesen nicht gibt wird eine Fehlermeldung ausgegeben
 */
app.get('/findcustomerbyid/:customer_id', async (req, res, next) => {
    try {
        const findcustomer = await customer.find_customer_by_id(req.params.customer_id);
        if (findcustomer == undefined) {
            res.status(404).send(`Customer with ID ${req.params.customer_id} not found`);
        } else {
            res.status(201).send(findcustomer)
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Daten, die geändert zu einem Kunden (ID) geändert werden sollen, werden übgeben
 * Es wird eine Fehlermeldung übergeben, falls Kunde mit der angegebenen ID nicht existiert
 */
app.put('/updatecustomer/:id', async (req, res, next) => {
    try {
        const findcustomer = await customer.find_customer_by_id(req.params.id);
        if (findcustomer == undefined) {
            res.status(404).send({ error: `Customer ${req.params.id} not found` });
            return;
        } else {
            const result = await customer.update_customer(req.params.id, req.body);
            res.status(204).send();
        }
    } catch (err) {
        next(err)
    }
});

/**
 * Überprüfen, ob ein Kunde existiert
 * Sende TRUE oder FALSE
 */
app.get('/existcustomer/:id', async (req, res, next) => {
    try {
        const exists = await customer.bool_exist_customer(req.params.id);
        if(exists != undefined){
            res.status(200).send(true);
        }else{
            res.status(404).send(false);
        }
            
    }catch(err){
        next(err)
    }
});


/**
 * Routen zu Projekt
 * 
 * Übergib alle existierenden Projekte
 */

app.get('/getallproject', async (req, res, next) => {
    try {
        res.send(await project.get_all_project());
    } catch (err) {
        next(err)
    }
});
/**
 * Übergebe Daten und erstelle ein neues Projekt
 */
app.post('/createproject', async (req, res, next) => {
    try {
        await project.create_project(req.body);
        res.status(204).send()
    } catch (err) {
        next(err)
    }
});
/**
 * Findet ein Projekt anhand der angegebenen ID
 * Fehlermeldung falls das Projekt nicht existiert
 */
app.get('/findprojectbyid/:project_id', async (req, res, next) => {
    try {
        const findproject = await project.find_project_by_id(req.params.project_id);
        if (findproject == undefined) {
            res.status(404).send(`Project with ID ${req.params.project_id} not found`);
        } else {
            res.status(201).send(findproject)
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Gibt alle Projekte zu der angefragten Kunden ID zurück
 */
app.get('/getprojectbycustomer/:id', async (req, res, next) => {
    try {
        const projcustomer = await project.get_project_by_customer(req.params.id);
        res.status(200).send(projcustomer);
    } catch (err) {
        next(err)
    }
})
/**
 * Übergebe Daten, die geändert werden sollen
 * Projekt wird anhand seiner ID ausgewählt
 * Existiert das Projekt nicht wird eine Fehlermeldung ausgegeben
 */
app.put('/updateproject/:id', async (req, res, next) => {
    try {
        const exists = await project.find_project_by_id(req.params.id);
        if (exists == undefined) {
            res.status(404).send({ error: `Project with ID ${req.params.id} not found` });
        } else {
            const worker = await project.update_project(req.params.id, req.body);
            res.status(201).send(worker);
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Überprüfen, ob ein Projekt existiert
 * Fehlermeldung falls keins existiert
 */
app.get('/existproject/:id', async (req, res, next) => {
    try {
        const exists = await project.bool_exist_project(req.params.id);
        if(exists != undefined){
            res.status(200).send(true);
        }else{
            res.status(404).send(false);
        }
            
    }catch(err){
        next(err)
    }
});

/**
 * Ändert den Projektstatus eines Projekts
 * Fehlermeldung falls das Projekt mit der angegebenen ID nicht existiert
 */
app.put('/updateprojectstatus/:project_id', async (req,res,next) =>{
    try{
        exists = await project.find_project_by_id(req.params.project_id)
        if(exists == undefined){
            res.status(404).send({error: `Project with ID ${req.params.project_id} not found`})
        }else{
            await project.update_project_status(req.params.project_id, req.body);
            res.status(204).send();
        }
    }catch(err){
        next(err)
    }
})
/**
 * Routen zu Einsätze
 * 
 * Gibt alle Einsätze aus
 */

app.get('/getallservice', async (req, res, next) => {
    try {
        res.send(await service.get_all_service());
    } catch (err) {
        next(err)
    }
});
/**
 * Daten werden übermittelt und ein neues Projekt wird erstellt
 */
app.post('/createservice', async (req, res, next) => {
    try {
        await service.create_service(req.body);
        res.status(204).send();
    } catch (err) {
        next(err)
    }
});
/**
 * Findet einen Einsatz anhand der ID
 * Fehlermeldung falls der Einsatz nicht existiert
 */
app.get('/findservicebyid/:id', async (req, res, next) => {
    try {
        const findservice = await service.find_service_by_id(req.params.id);
        if (findservice == undefined) {
            res.status(404).send(`Service with ID ${req.params.id} not found`)
        } else {
            res.status(200).send(findservice);
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Daten die geändert werden sollen werden übermittel 
 * Der geänderte Einsatz wird mit der ID angegeben
 * Fehlermeldung falls der Einsatz nicht existiert
 */
app.put('/updateservice/:id', async (req, res, next) => {
    try {
        const findservice = await service.find_service_by_id(req.params.id);
        if (findservice == undefined) {
            res.status(404).send(`Service with ID ${req.params.id} not found`)
        } else {
            await service.update_service(req.params.id, req.body);
            res.status(204).send();
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Überprüfen, ob Einsatz mit der angegebenen ID existiert
 * TRUE oder FALSE wird an den Clienten gesendet
 */
app.get('/existservice/:id', async (req, res, next) => {
    try {
        const exists = await service.bool_exist_service(req.params.id);
        if(exists != undefined){
            res.status(200).send(true);
        }else{
            res.status(404).send(false);
        }
            
    }catch(err){
        next(err)
    }
});
/**
 * Löschen eines Einsatzes anhand seiner ID
 * Zuerst überprüfen, ob der Einsatz existiert
 * Fehlermeldung falls dieser nicht existiert
 */
app.delete('/deleteservice/:id', async (req, res, next) => {
    try {
        const exists = await service.find_service_by_id(req.params.id);
        if (exists == undefined) {
            res.status(404).send({ error: `Service ${req.params.id} not found`});
        } else {
            const worker = await service.delete_service(req.params.id);
            res.status(204).send();
        }
    } catch (err) {
        next(err)
    }
});
/**
 * Gibt alle Projekte mit den dazugehörigen Einsätzen zurück
 */
app.get('/getallprojectwithservice', async (req,res,next) => {
    try{
        res.send(await project.get_all_project_with_service());
    } catch(err){
        next(err);
    }
})
/**
 * Gibt Bezahlstatus eines Einsatzes an
 * Zuerst wird überprüft, ob der angefragte Einsatz existiert
 */
app.get('/getserviceispaid/:service_id', async (req,res,next) =>{
    try{
        const exists = await service.find_service_by_id(req.params.service_id);
        if(exists == undefined){
            res.status(404).send({error: `Service with ID ${req.params.service_id} not found`})
        } else{
            is_paid = await service.boolean_get_is_paid(req.params.service_id);
            res.status(200).send(is_paid);
        }

    }catch (err) {
        next(err)
    }
})
/**
 * Ändert den Bezahlstatus eines Einsatzes (ID)
 * Fehlermeldung falls dieser nicht existiert
 */
app.put('/updateserviceispaid/:service_id', async (req,res,next) =>{
    try{
        exists = await service.find_service_by_id(req.params.service_id);
        if(exists == undefined){
            res.status(404).send({error: `Service with ID ${req.params.service_id} not found`})
        }else{
            await service.update_service_is_paid(req.params.service_id, req.body);
            res.status(204).send();
        }
    }catch(err){
        next(err)
    }
})


app.listen(5000);
console.log('[SERVER] Der Backend-Server wurde erfolgreich gestartet.');
