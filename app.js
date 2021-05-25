const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT 
        *
        FROM cricket_team
    `;
  const PlayersArray = await db.all(getPlayersQuery);
  response.send(PlayersArray);
});

// Add Player API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetails = `
        INSERT INTO 
        cricket_team(player_name,jersey_number,role)
        VALUES 
        ("${playerName}",
        ${jerseyNumber},
        "${role}");
        `;
  const dbResponse = await db.run(addPlayerDetails);

  response.send("Player Added to Team");
});

// Get Player API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerDetails = `
        SELECT *
        FROM cricket_team
        WHERE player_id = ${player_id};`;

  const player = await db.get(getPlayerDetails);

  response.send(player);
});

//PUT PLAYER API

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const updatePlayerDetails = `
        UPDATE cricket_team
        player_name = "${playerName}";
        jersey_number = "${jerseyNumber}";
        role = "${role}";
        WHERE player_id = ${playerId};`;

  const player = await db.run(updatePlayerDetails);

  response.send("Player Details Updated");
});

//Delete PLAYER API

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = ` 
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Deleted Successfully");
});
