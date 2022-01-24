<template>
  <main>
    <v-layout>
      <!-- Die Anwenderinformation gibt Auskunft darüber, wo der Anwender sich befindet -->
      <v-card width="100%" flat color="#FAFAFA">
        <v-card-title class="body-2">
          <v-icon left color="#0747A6">mdi-folder-text-outline</v-icon>Projekte
          <v-spacer></v-spacer>
          <!-- ## Buttons zum Anlegen/Ändern/Bearbeiten eines Projekts ## -->
          <v-layout justify-end ml-1>
            <!-- Button: Projekt anlegen mit Dialog der durch Klick aktiviert wird -->
            <v-dialog v-model="dialog" width="600" transition="dialog-bottom-transition">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip top small>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      color="#0747A6"
                      rounded
                      dark
                      elevation="0"
                      class="mr-2"
                      small
                      v-on="{ ...tooltip, ...dialog }"
                    >
                      <v-icon small class="mr-1">mdi-file-plus</v-icon>Neu
                    </v-btn>
                  </template>
                  <span>Projekt anlegen</span>
                </v-tooltip>
              </template>
              <!-- Projekt anlegen: Ansicht des Dialogs -->
              <v-card>
                <!-- Dialog-Fenster zum Projekt anlegen mit Speicher-Button -->
                <v-toolbar dark flat tile color="#0747A6">
                  <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Projekt anlegen</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn text @click="createproject">
                    <v-icon class="mr-1">mdi-content-save</v-icon>Speichern
                  </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- Text-Felder zum Anlegen eines neuen Projekts -->
                  <v-card-text>
                    <v-card-text>
                      <v-form ref="form">
                      <v-text-field
                        label="Kundennummer"
                        v-model="newproject.customer_id"
                        outlined
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Titel"
                        v-model="newproject.project_title"
                        outlined
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Beschreibung"
                        v-model="newproject.description"
                        outlined
                        dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      </v-form>
                    </v-card-text>
                  </v-card-text>
              </v-card>
            </v-dialog>
            <!-- Button: Projekt bearbeiten mit Dialog der durch Klick aktiviert wird -->
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
                    >
                      <v-icon small>mdi-file-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Projekt bearbeiten</span>
                </v-tooltip>
              </template>
              <!-- Projekt bearbeiten: Ansicht des Dialogs -->
              <v-card>
                <v-card-title class="body-1">Welches Projekt möchten sie bearbeiten?</v-card-title>
                  <v-card-text>
                    <v-form ref="form">
                    <v-text-field outlined dense label="Projekt ID" v-model="check_project" :rules="[rules.required]"></v-text-field>
                    <div class="errorMsg">{{errorMsg}}</div>
                    </v-form>
                  </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="#004790" text @click="closeDialog">Abbrechen</v-btn>
                  <v-btn small color="#004790" dark @click="findprojectById">Bearbeiten</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Dialog: Projekt Bearbeiten mit Änderungsmöglichkeiten für Projekt wenn Funktion "findPersonalbyID" die ID gefunden hat -->
            <v-dialog v-model="dialog4" max-width="600" transition="dialog-bottom-transition">
              <v-card>
                <v-toolbar dark flat tile color="#0747A6">
                  <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Projekt bearbeiten</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn text @click="updateproject">
                    <v-icon class="mr-1">mdi-content-save</v-icon>Ändern
                  </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- Text-Felder zum bearbeiten von Projektinformationen -->
                <v-card-text>
                    <v-card-text>
                      <b>Information:</b> Sie können nur die Adresse und den Ansprechpartner ändern!
                      <v-text-field
                        label="Titel"
                        v-model="newproject.project_title"
                      ></v-text-field>
                      <v-text-field
                        label="Beschreibung"
                        v-model="newproject.description"
                      ></v-text-field>
                    </v-card-text>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-card-title>
        <!-- ## Ende der Buttons zum Anlegen/Ändern/Bearbeiten eines Kunden ## -->
        <!-- Ausgabe der Projektansicht -->
        <v-card tile color="#FAFAFA" elevation="0">
          <!-- Meldung wenn keine Einsätze hinterlegt sind -->
          <template v-if="project == null">
            <v-card color="#FAFAFA" class="mt-5 caption" flat justify-center>
              <v-icon class="ml-4 mr-2">mdi-alert</v-icon>Es existieren keine angelegten Projekte.
            </v-card>
          </template>
          <template v-else>
            <v-card
              flat
              tile
              v-for="(project, index) in project"
              :key="index"
              class="mr-4 ml-4 mb-2"
            >
              <v-expansion-panels accordion>
                <v-expansion-panel class="border">
                  <v-expansion-panel-header
                    v-model="selectedProject1"
                  >
                  <!-- Ausgabe der Projektinformationen -->
                    <v-layout row wrap pl-3>
                      <v-flex xs12 md12 mb-2>
                        <div>
                          <v-chip color="#0749AB" dark small class="mb-2">Projekt: {{project.project_title}}</v-chip>
                          <div class="caption grey--text">Beschreibung:</div>
                          {{project.description}}
                        </div>
                      </v-flex>
                      <v-flex xs4 md4 mb-2>
                        <div class="caption grey--text">Projekt-ID</div>
                        <v-icon small class="mr-1">mdi-buffer</v-icon>
                        {{project.project_id}}
                      </v-flex>
                      <v-flex xs4 sm4 md4>
                        <div class="caption grey--text">Kunden-ID</div>
                        <div>
                          <v-icon small class="mr-1">mdi-account</v-icon>
                          {{project.customer_id}}
                        </div>
                      </v-flex>
                      <v-flex xs5 sm4 md4 mt-1>
                        <div>
                          <template v-if="project.project_status_id == 1">
                            <v-btn dark rounded elevation="0" x-small color="green" width="100" @click="updateStatus(project)"
                              v-model="selectedProject">
                              <v-icon left small>mdi-check-circle</v-icon>Aktiv
                            </v-btn>
                          </template>
                          <template v-else-if="project.project_status_id == 2">
                            <v-btn
                              dark
                              elevation="0"
                              rounded
                              x-small
                              width="100"
                              color="red"
                            >
                              <v-icon left small>mdi-check-circle-outline</v-icon>Beendet
                            </v-btn>
                          </template>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-expansion-panel-header>
                  <!-- Ausgabe der Projektbezogenen Einsätze -->
                  <v-expansion-panel-content>
                    <v-divider class="mb-3"></v-divider>
                    <template v-if="project.servicebyproject[0] == ''">
                      <div class="smallFont">
                        <v-icon left small>mdi-alert</v-icon>Für dieses Projekt sind keine Einsätze angelegt worden.
                      </div>
                    </template>
                    <template v-else>
                      <h5>Zugehörige Einsätze</h5>
                      <v-card
                        flat
                        outlined
                        class="mb-2 pa-2"
                        color="#F3F3F3"
                        tile
                        v-for ="(projectservices, index) in project.servicebyproject[0]" :key="index"
                      >
                        <v-layout row wrap pl-3 class="smallFont">
                          <v-flex xs4 sm4 md2>
                            <div class="caption grey--text mb-1">Einsatz-ID</div>
                            <div>
                              <v-icon small class="mr-1">mdi-layers</v-icon>
                              {{projectservices.service_id}}
                            </div>
                          </v-flex>
                          <v-flex xs4 sm4 md2>
                            <div class="caption grey--text mb-1">Datum</div>
                            <div>
                              <v-icon small class="mr-1">mdi-calendar</v-icon>
                              {{projectservices.date}}
                            </div>
                          </v-flex>
                          <v-flex xs12 sm4 md8>
                            <div class="caption grey--text mb-1">Beschreibung</div>
                            <div>
                              <v-icon small class="mr-1">mdi-layers</v-icon>
                              {{projectservices.job_description}}
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-divider></v-divider>
            </v-card>
          </template>
        </v-card>
      </v-card>
    </v-layout>
    <!-- Einblendung einer Benachrichtigung bei erfolgreichem Event mit Nachricht -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top right>
      {{ infoText }}
      <v-btn color="blue" text @click="snackbar = false">OK</v-btn>
    </v-snackbar>
  </main>
</template>

<script src="./functions.vue">
</script>

<!-- Style-Section -->
<style>
.v-tabs {
  font-size: 12px;
}
.v-tab {
  font-size: 12px;
}
.smallFont {
  font-size: 13px;
}

.border {
  border-left: 0.25em solid #0749ab;
}

.v-expansion-panel-header {
  font-size: 13px;
}

.v-expansion-panel::before {
  box-shadow: none;
}
</style>
