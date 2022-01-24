<template>
  <main>
    <v-layout>
      <!-- Die Anwenderinformation gibt Auskunft darüber, wo der Anwender sich befindet -->
      <v-card width="100%" flat color="#FAFAFA">
        <v-card-title class="body-2">
          <v-icon left color="#0747A6">mdi-folder</v-icon>Einsätze
          <v-spacer></v-spacer>
          <!-- ## Buttons zum Anlegen/Ändern/Bearbeiten eines Projekts ## -->
          <v-dialog v-model="dialog" width="800" transition="dialog-bottom-transition">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip top small>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    color="#0747A6"
                    rounded
                    dark
                    elevation="0"
                    small
                    v-on="{ ...tooltip, ...dialog }"
                    class="mr-1"
                  >
                    <v-icon left small>mdi-file-plus</v-icon>NEU
                  </v-btn>
                </template>
                <span>Einsatz anlegen</span>
              </v-tooltip>
            </template>
            <!-- Einsatz anlegen: Ansicht des Dialogs -->
            <v-card>
              <v-toolbar dark flat color="#0747A6">
                <v-btn icon dark @click="closeDialog">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Einsatz anlegen</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-divider></v-divider>
              <!-- 3 - Schritte Stepper zum Anlegen eines Einsatzes-->
              <v-stepper v-model="nextStep" class="smallFont" elevation-0>
                <v-stepper-items>
                  <!-- Schritt 1 - Angabe der Kunden-ID -->
                  <v-stepper-content step="1">
                    <div
                      class="smallFont"
                    >Bitte geben Sie die Kunden-ID ein, für die sie einen Einsatz anlegen wollen.</div>
                    <v-text-field
                      outlined
                      dense
                      class="mb-5 mt-3"
                      label="Kunden-ID"
                      v-model="check_customer"
                    ></v-text-field>
                    <div class="errorMsg">{{errorMsg}}</div>
                    <br />
                    <v-btn color="#004790" dark small @click="findCustomerById">Weiter</v-btn>
                    <v-btn color="#004790" text small @click="closeDialog">Abbrechen</v-btn>
                  </v-stepper-content>
                  <!-- Schritt 2 - Zuordnung der Projektzugehörigkeit -->
                  <v-stepper-content step="2">
                    <h3>Für welches Projekt soll der Einsatz angelegt werden?</h3>Bitte geben Sie an zu welchem Projekt der Einsatz gehört. (Nur aktive Projekte möglich)
                    <br />
                    <br />
                    <!-- Es werden nur aktive Projekt angezeigt / Wenn der Kunde kein Projekt hat ERRORMESSAGE -->
                    <template v-if="customerProjects == 0">
                      <v-card class="smallFont mb-5" color="red" dark flat>
                        <v-icon class="ma-2" dark>mdi-alert</v-icon>Der von Ihnen gewählte Kunde hat kein aktives Projekt.
                      </v-card>
                    </template>
                    <template v-else>
                      <!-- Ausgabe der Projekte in Form von anklickbaren Karten -->
                      <v-layout align-content-center row wrap ml-1>
                        <v-card
                          outlined
                          hover
                          width="90%"
                          class="mr-5 mb-5"
                          v-for="(project,index) in customerProjects"
                          :key="index"
                          v-model="selectedProject"
                          @click="handlerFunction(project)"
                        >
                          <template>
                            <div class="blueLine" dark></div>
                            <v-list-item>
                              <v-list-item-icon>
                                <v-chip small color="#0749AB" dark>
                                  <v-icon>mdi-buffer</v-icon>
                                  {{project.project_id}}
                                </v-chip>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>{{project.project_title}}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item dense>
                              <v-list-item-content>
                                <v-list-item-subtitle>Beschreibung</v-list-item-subtitle>
                                {{project.description}}
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-card>
                      </v-layout>
                    </template>
                    <v-btn color="#0749AB" text small @click="nextStep = 1">Zurück</v-btn>
                  </v-stepper-content>
                  <!-- Schritt 3 - Eintragen der Einsatzinformationen -->
                  <v-stepper-content step="3">
                    <h3>Einsatzinformationen</h3>Tragen Sie hier die Informationen zum anzulegenden Einsatz ein:
                    <br />
                    <br />
                    <!-- Text-Felder für das Eintragen von Einsatzinformationen -->
                    <v-form ref="form">
                      <v-text-field
                        type="time"
                        label="Beginn (Arbeitszeit)"
                        v-model="newService.wh_start"
                        outlined
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        type="time"
                        label="Ende (Arbeitszeit)"
                        v-model="newService.wh_end"
                        outlined
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        type="text"
                        label="Beschreibung"
                        outlined
                        dense
                        v-model="newService.job_description"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <br />
                      <h3>Optionale Angaben</h3>
                      <br />
                      <v-text-field
                        type="time"
                        label="Anfahrt (Fahrtzeit)"
                        v-model="newService.tt_start"
                        outlined
                        dense
                      ></v-text-field>
                      <v-text-field
                        type="time"
                        label="Abfahrt (Fahrtzeit)"
                        v-model="newService.tt_end"
                        outlined
                        dense
                      ></v-text-field>
                    </v-form>
                    <v-btn color="#0749AB" dark small @click="createService">Erstellen</v-btn>
                    <v-btn color="#0749AB" text small @click="nextStep = 2">Zurück</v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-card>
          </v-dialog>
          <!-- Button: Einsatz bearbeiten mit Dialog der durch Klick aktiviert wird -->
          <v-dialog v-model="dialog3" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    color="#0747A6"
                    rounded
                    dark
                    elevation="0"
                    small
                    v-on="{ ...tooltip, ...dialog }"
                    class="mr-1"
                  >
                    <v-icon small>mdi-file-edit</v-icon>
                  </v-btn>
                </template>
                <span>Einsatz bearbeiten</span>
              </v-tooltip>
            </template>
            <!-- Einsatz bearbeiten: Ansicht des Dialogs -->
            <v-card>
              <v-card-title class="body-1">Welchen Einsatz möchten Sie bearbeiten?</v-card-title>
              <v-form ref="form">
                <v-card-text>
                  <v-text-field outlined dense label="Einsatz-ID" v-model="check_Service"></v-text-field>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="#0749AB" text @click="closeDialog">Abbrechen</v-btn>
                <v-btn small color="#0749AB" dark @click="findServiceById">Bearbeiten</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- Dialog: Einsatz Bearbeiten mit Änderungsmöglichkeiten für Einsätze wenn Funktion "findServicebyID" die ID gefunden hat -->
          <v-dialog v-model="dialog4" max-width="600" transition="dialog-bottom-transition">
            <v-card>
              <v-toolbar dark flat color="#0747A6">
                <v-btn icon dark @click="closeDialog">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Einsatz bearbeiten</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn text @click="updateService">
                  <v-icon class="mr-2">mdi-content-save</v-icon>Ändern
                </v-btn>
              </v-toolbar>
              <v-divider></v-divider>
              <!-- Text-Felder zum bearbeiten von Einsatzinformationen -->
              <v-card-text>
                <v-form ref="form">
                  <v-card-subtitle></v-card-subtitle>
                  <v-card-text>
                    <v-text-field
                      type="time"
                      label="Beginn (Arbeitszeit)"
                      v-model="newService.wh_start"
                    ></v-text-field>
                    <v-text-field
                      type="time"
                      label="Ende (Arbeitszeit)"
                      v-model="newService.wh_end"
                    ></v-text-field>
                    <v-text-field
                      type="time"
                      label="Anfahrt (Fahrtzeit)"
                      v-model="newService.tt_start"
                    ></v-text-field>
                    <v-text-field
                      type="time"
                      label="Abfahrt (Fahrtzeit)"
                      v-model="newService.tt_end"
                    ></v-text-field>
                    <v-text-field
                      type="text"
                      label="Tätigkeit"
                      v-model="newService.job_description"
                    ></v-text-field>
                  </v-card-text>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- Funktion: Einsatz löschen -->
          <v-dialog v-model="dialog2" persistent max-width="600px">
            <template v-slot:activator="{ on: dialog }">
              <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    color="#0747A6"
                    rounded
                    small
                    dark
                    elevation="0"
                    v-on="{ ...tooltip, ...dialog }"
                  >
                    <v-icon small>mdi-file-cancel</v-icon>
                  </v-btn>
                </template>
                <span>Einsatz löschen</span>
              </v-tooltip>
            </template>
            <!-- Dialog-Fenster zum Einsatz löschen -->
            <v-card>
              <v-card-title class="body-1">Welchen Einsatz möchten Sie löschen?</v-card-title>
              <v-card-text>
                <v-text-field outlined dense label="Einsatz-ID" v-model="delete_service"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="#004790" text @click="closeDialog">Abbrechen</v-btn>
                <v-btn small color="#004790" dark @click="deleteService">Löschen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <!-- ## Ende der Buttons zum Anlegen/Ändern/Bearbeiten eines Kunden ## -->
        <!-- Tabs um zwischen "Alle Einsätze" und "Meine Einsätze" zu wechseln -->
        <template>
          <v-tabs height="35" color="#004790" background-color="#FAFAFA" hide-slider>
            <v-tab>
              <v-icon small left>mdi-folder-open</v-icon>Alle Einsätze
            </v-tab>
            <v-tab @click="getServiceTechnicianService()">
              <v-icon small left>mdi-folder-open-outline</v-icon>Meine Einsätze
            </v-tab>
            <!-- Ausgabe der Einsätze innerhalb des ersten Tabs -->
            <v-tab-item>
              <v-card tile flat color="#FAFAFA">
                <!-- Meldung wenn keine Einsätze hinterlegt sind -->
                <template v-if="services == 0">
                  <v-card color="#FAFAFA" class="mt-5" flat>
                    <v-icon class="ml-4 mr-2">mdi-alert</v-icon>Bisher wurden keine Einsätze angelegt.
                  </v-card>
                </template>
                <!-- Ausgabe und Formatierung der Einsätze -->
                <template v-else>
                  <v-card
                    tile
                    flat
                    v-for="(service, index) in services"
                    :key="index"
                    class="mr-4 ml-4 mb-2"
                  >
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header class="border">
                          <v-layout row wrap pl-3>
                            <v-flex xs4 md3>
                              <div class="caption font-weight-bold mb-1">Einsatz-ID</div>
                              <div>
                                <v-chip color="#0749AB" dark small>
                                  <v-icon small class="mr-1">mdi-layers</v-icon>
                                  {{service.service_id}}
                                </v-chip>
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3>
                              <div class="caption grey--text mb-1">Projekt-ID</div>
                              <div>
                                <v-icon small class="mr-1">mdi-buffer</v-icon>
                                {{service.project_id}}
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3>
                              <div class="caption grey--text mb-1">Datum</div>
                              <div>
                                <v-icon small class="mr-1">mdi-calendar</v-icon>
                                {{service.date}}
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3 mt-4>
                              <div>
                                <template v-if="service.service_ispaid_id == 2">
                                  <v-btn
                                    dark
                                    rounded
                                    elevation="0"
                                    x-small
                                    color="green"
                                    width="100"
                                  >
                                    <v-icon left small>mdi-credit-card-outline</v-icon>BEZAHLT
                                  </v-btn>
                                </template>
                                <template v-else-if="service.service_ispaid_id == 1">
                                  <v-btn
                                    dark
                                    elevation="0"
                                    rounded
                                    x-small
                                    width="100"
                                    color="red"
                                    @click="updatePayment(service)"
                                    v-model="selectedService"
                                  >
                                    <v-icon left small>mdi-credit-card-marker-outline</v-icon>OFFEN
                                  </v-btn>
                                </template>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-expansion-panel-header>
                        <!-- Weitere Einsatzinformationen -->
                        <v-expansion-panel-content class="border">
                          <h4>Einsatzinformationen:</h4>
                          <v-layout row wrap class="pa-3">
                            <v-flex xs6 sm4 md3 mb-2>
                              <div class="caption grey--text">Arbeitsbeginn</div>
                              <div>
                                <v-icon small class="mr-1">mdi-clock</v-icon>
                                {{service.wh_start}} Uhr
                              </div>
                            </v-flex>
                            <v-flex xs6 sm4 md3 mb-2>
                              <div class="caption grey--text">Arbeitsende</div>
                              <div>
                                <v-icon small class="mr-1">mdi-clock</v-icon>
                                {{service.wh_end}} Uhr
                              </div>
                            </v-flex>
                            <template v-if="service.tt_start != null && service.tt_end != null">
                              <v-flex xs6 sm4 md3 mb-2>
                                <div class="caption grey--text">Anfahrt (Hinweg)</div>
                                <div>
                                  <v-icon small class="mr-1">mdi-car</v-icon>
                                  {{service.tt_start}} Uhr
                                </div>
                              </v-flex>
                              <v-flex xs6 sm4 md3 mb-2>
                                <div class="caption grey--text">Ankunft (Rückweg)</div>
                                <div>
                                  <v-icon small class="mr-1">mdi-car</v-icon>
                                  {{service.tt_end}} Uhr
                                </div>
                              </v-flex>
                            </template>
                            <v-flex xs4 sm4 md3 mt-2>
                              <div class="caption grey--text">Erledigt von</div>
                              <div>
                                <v-icon small class="mr-1">mdi-account-supervisor-circle</v-icon>
                                {{service.personal_id}}
                              </div>
                            </v-flex>
                            <v-flex xs8 sm4 md8 mt-2>
                              <div class="caption grey--text">Beschreibung</div>
                              <div>{{service.job_description}}</div>
                            </v-flex>
                          </v-layout>
                        </v-expansion-panel-content>
                        <v-divider></v-divider>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </template>
              </v-card>
            </v-tab-item>
            <!-- Tab: Meine Einsätze -->
            <v-tab-item>
              <v-card color="#FAFAFA" elevation="0" tile>
                <!-- Meldung wenn keine Einsätze hinterlegt sind -->
                <template v-if="myservices == 0">
                  <v-card color="#FAFAFA" class="mt-5" flat>
                    <v-icon class="ml-4 mr-2">mdi-alert</v-icon>Sie haben noch keine Einsätze erstellt.
                  </v-card>
                </template>
                <!-- Ausgabe und Formatierung der Einsätze -->
                <template v-else>
                  <v-card
                    flat
                    tile
                    v-for="(service, index) in myservices"
                    :key="index"
                    class="mr-4 ml-4 mb-2"
                  >
                    <v-expansion-panels accordion>
                      <v-expansion-panel class="border">
                        <v-expansion-panel-header>
                          <v-layout row wrap pl-3>
                            <v-flex xs4 md3>
                              <div class="caption font-weight-bold mb-1">Einsatz-ID</div>
                              <div>
                                <v-chip color="#0749AB" dark small>
                                  <v-icon small class="mr-1">mdi-layers</v-icon>
                                  {{service.service_id}}
                                </v-chip>
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3>
                              <div class="caption grey--text">Projekt-ID</div>
                              <div>
                                <v-icon small class="mr-1">mdi-buffer</v-icon>
                                {{service.project_id}}
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3>
                              <div class="caption grey--text">Datum</div>
                              <div>
                                <v-icon small class="mr-1">mdi-calendar</v-icon>
                                {{service.date}}
                              </div>
                            </v-flex>
                            <v-flex xs4 sm4 md3 mt-3>
                              <div>
                                <template v-if="service.service_ispaid_id == 2">
                                  <v-btn
                                    dark
                                    rounded
                                    elevation="0"
                                    x-small
                                    color="green"
                                    width="100"
                                  >
                                    <v-icon left small>mdi-credit-card-outline</v-icon>BEZAHLT
                                  </v-btn>
                                </template>
                                <template v-else-if="service.service_ispaid_id == 1">
                                  <v-btn
                                    dark
                                    elevation="0"
                                    rounded
                                    x-small
                                    width="100"
                                    color="red"
                                    @click="updatePayment(service)"
                                    v-model="selectedService"
                                  >
                                    <v-icon left small>mdi-credit-card-marker-outline</v-icon>OFFEN
                                  </v-btn>
                                </template>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-expansion-panel-header>
                        <!-- Weitere Einsatzinformationen -->
                        <v-expansion-panel-content>
                          <v-divider class="mb-3"></v-divider>
                          <h4>Einsatzinformationen:</h4>
                          <v-layout row wrap class="pa-3">
                            <v-flex xs6 sm4 md3 mb-2>
                              <div class="caption grey--text">Arbeitsbeginn</div>
                              <div>
                                <v-icon small class="mr-1">mdi-clock</v-icon>
                                {{service.wh_start}} Uhr
                              </div>
                            </v-flex>
                            <v-flex xs6 sm4 md3 mb-2>
                              <div class="caption grey--text">Arbeitsende</div>
                              <div>
                                <v-icon small class="mr-1">mdi-clock</v-icon>
                                {{service.wh_end}} Uhr
                              </div>
                            </v-flex>
                            <template v-if="service.tt_start != null && service.tt_end != null">
                              <v-flex xs6 sm4 md3 mb-2>
                                <div class="caption grey--text">Anfahrt (Hinweg)</div>
                                <div>
                                  <v-icon small class="mr-1">mdi-car</v-icon>
                                  {{service.tt_start}} Uhr
                                </div>
                              </v-flex>
                              <v-flex xs6 sm4 md3 mb-2>
                                <div class="caption grey--text">Ankunft (Rückweg)</div>
                                <div>
                                  <v-icon small class="mr-1">mdi-car</v-icon>
                                  {{service.tt_end}} Uhr
                                </div>
                              </v-flex>
                            </template>
                            <v-flex xs12 sm4 md12 mt-2>
                              <div class="caption grey--text">Beschreibung</div>
                              <div>{{service.job_description}}</div>
                            </v-flex>
                          </v-layout>
                        </v-expansion-panel-content>
                        <v-divider></v-divider>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </template>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </template>
      </v-card>
    </v-layout>
    <!-- Einblendung einer Benachrichtigung bei erfolgreichem Event mit Nachricht -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top right>
      {{ infoText }}
      <v-btn color="blue" text @click="snackbar = false">OK</v-btn>
    </v-snackbar>
  </main>
</template> 

<script src="./functions.vue"></script>

<style src="./style.vue"></style>