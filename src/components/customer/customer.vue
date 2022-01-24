<template>
  <main>
    <v-layout>
      <!-- Die Anwenderinformation gibt Auskunft darüber, wo der Anwender sich befindet -->
      <v-card width="100%" flat color="#FAFAFA">
        <!-- Titel der Page mit Subpage und Trennstrich -->
        <v-card-title class="body-2">
          <v-icon class="mr-2" color="#0747A6">mdi-account-circle</v-icon>Kunden
          <v-spacer></v-spacer>
          <!-- ## Buttons zum Anlegen/Ändern/Bearbeiten eines Kunden ## -->
          <v-layout justify-end ml-1>
            <!-- Button: Kunde anlegen mit Dialog der durch Klick aktiviert wird -->
            <v-dialog v-model="dialog" width="600" transition="dialog-bottom-transition">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip top small>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      color="#0747A6"
                      class="mr-2"
                      rounded
                      dark
                      elevation="0"
                      small
                      v-on="{ ...tooltip, ...dialog }"
                    >
                      <v-icon small left>mdi-file-plus</v-icon>Neu
                    </v-btn>
                  </template>
                  <span>Kunde anlegen</span>
                </v-tooltip>
              </template>
              <!-- Kunde anlegen: Ansicht des Dialogs -->
              <v-card>
                <!-- Dialog-Fenster zum Kunde anlegen mit Speicher-Button -->
                <v-toolbar dark flat tile color="#0747A6">
                  <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Kunde anlegen</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn text @click="createCustomer">
                    <v-icon class="mr-2">mdi-content-save</v-icon>Speichern
                  </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- Text-Felder zum Anlegen eines neuen Kunden -->
                <v-form ref="form">
                  <v-card-text>
                    <v-card-text>
                      <v-text-field 
                      label="Firma" 
                      v-model="newCustomer.company"
                      outlined dense
                      :rules="[rules.required]">
                      </v-text-field>
                      <v-text-field 
                      label="Straße" 
                      v-model="newCustomer.street"
                      outlined dense 
                      :rules="[rules.required]">
                      </v-text-field>
                      <v-text-field
                        label="Postleitzahl"
                        v-model="newCustomer.postal_code"
                        outlined dense
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field 
                      label="Ort" 
                      v-model="newCustomer.location" 
                      outlined dense
                      :rules="[rules.required]">
                      </v-text-field>
                      <v-text-field
                        label="Vorname (Ansprechpartner)"
                        outlined dense
                        v-model="newCustomer.fname_poc"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Nachname (Ansprechparter)"
                        outlined dense
                        v-model="newCustomer.lname_poc"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-card-text>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- Button: Kunde bearbeiten mit Dialog der durch Klick aktiviert wird -->
            <v-dialog v-model="dialog3" persistent max-width="600px">
              <template v-slot:activator="{ on: dialog }">
                <v-tooltip top>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      color="#0747A6"
                      class="mr-2"
                      rounded
                      dark
                      elevation="0"
                      small
                      v-on="{ ...tooltip, ...dialog }"
                    >
                      <v-icon small class="mr-1">mdi-file-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Kunde bearbeiten</span>
                </v-tooltip>
              </template>
              <!-- Dialog-Fenster zum Kunde bearbeiten -->
              <v-card>
                <v-card-title class="body-1">Welchen Kunden möchten Sie bearbeiten?</v-card-title>
                <v-form ref="form1">
                  <v-card-text>
                    <v-text-field outlined dense label="Kundennummer" v-model="check_customer" :rules="[rules.required]"></v-text-field>
                  </v-card-text>
                </v-form>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="#004790" text @click="closeDialog">Abbrechen</v-btn>
                  <v-btn small color="#004790" dark @click="findCustomerById">Bearbeiten</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- Dialog: Kunde Bearbeiten mit Änderungsmöglichkeiten für Kunden wenn Funktion "findPersonalbyID" die ID gefunden hat -->
            <v-dialog v-model="dialog4" max-width="600" transition="dialog-bottom-transition">
              <v-card>
                <!-- Dialog-Fenster zum Kunde bearbeiten mit Speicher-Button -->
                <v-toolbar dark flat tile color="#0747A6">
                  <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Kunde bearbeiten</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn text @click="updateCustomer">
                    <v-icon>mdi-content-save</v-icon>Ändern
                  </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <!-- Text-Felder zum bearbeiten von Kundeninformationen -->
                <v-card-text>
                  <v-form ref="form">
                    <v-card-text>
                      <v-text-field label="Straße" v-model="newCustomer.street" ></v-text-field>
                      <v-text-field
                        label="Postleitzahl"
                        v-model="newCustomer.postal_code"
                      ></v-text-field>
                      <v-text-field label="Ort" v-model="newCustomer.location" ></v-text-field>
                      <v-text-field
                        label="Vorname (Ansprechpartner)"
                        v-model="newCustomer.fname_poc"
                      ></v-text-field>
                      <v-text-field
                        label="Nachname (Ansprechpartner)"
                        v-model="newCustomer.lname_poc"
                      ></v-text-field>
                    </v-card-text>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-card-title>
        <!-- ## Ende der Buttons zum Anlegen/Ändern/Bearbeiten eines Kunden ## -->
        <!-- Ausgabe der Kundentabelle mit Kundendaten -->
        <v-card-text>
          <v-card>
            <div class="blueLine" dark></div>
            <v-card-title class="body-1">
              <b>Kundenliste</b>
              <v-spacer></v-spacer>
              <v-col md="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Suche"
                  outlined
                  single-line
                  dense
                  rounded
                  class="searchBar ml-auto"
                  hide-details
                  background-color="#FAFAFA"
                ></v-text-field>
              </v-col>
            </v-card-title>
            <v-divider></v-divider>
            <!-- Ausgabe der Kundentabelle mit Kundendaten -->
            <v-data-table :headers="headers" :items="customer" :search="search"></v-data-table>
          </v-card>
        </v-card-text>
      </v-card>
    </v-layout>
    <!-- Einblendung einer Benachrichtigung bei erfolgreichem Event mit Nachricht -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top right>
      {{ infoText }}
      <v-btn color="blue" text @click="snackbar = false">OK</v-btn>
    </v-snackbar>
  </main>
</template>

<script src="./functions"></script>

<!-- Style-Section -->
<style scoped>
.blueLine {
  display: flex;
  background-color: #0749ab;
  justify-content: center;
  padding: 2px;
}

tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.04);
}

.searchBar {
  font-size: 14px;
}
</style>