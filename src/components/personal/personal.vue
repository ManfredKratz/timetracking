<template>
  <main>
    <v-layout>
      <!-- Die Anwenderinformation gibt Auskunft darüber, wo der Anwender sich befindet -->
      <v-card width="100%" flat color="#FAFAFA">
        <v-card-title class="body-2">
          <v-icon class="mr-2" color="#0747A6">mdi-account-supervisor-circle</v-icon>Personal
        </v-card-title>
        <!-- Augabe der Personaltabelle -->
        <v-card-text>
          <v-card>
            <div class="blueLine" dark></div>
            <v-card-title class="body-1">
              <b>Service Techniker</b>
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
            <!-- Ausgabe der Personaltabelle mit Kundendaten -->
            <v-data-table :headers="headers" :items="Personal" :search="search"></v-data-table>
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
</style>