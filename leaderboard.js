function mappedYears(){
    var self = this;
    return [{ key: "", value: "", text: "All"}].concat(
        Array.from(new Set(self.races.map(r => r.year))).map(i => { return { key: i, value: i, text: i }}));
}

function filteredMonths(){
    var self = this;
    var races = self.races;

    if(self.filter.year !== ""){
        races = races.filter(r => r.year === self.filter.year);
    }

    return [{ key: "", value: "", text: "All"}].concat(
        Array.from(new Set(races.map(r => r.month))).map(i => { return { key: i, value: i, text: i }}));
}

function filteredRaces(){
    var self = this;
    var races = self.races;

    if(self.filter.year !== ""){
        races = races.filter(r => r.year === self.filter.year);
    }
    if(self.filter.month !== ""){
        races = races.filter(r => r.month === self.filter.month);
    }

    return [{ key: "", value: "", text: "All"}].concat(races.map(r => r.date).map(i => { return { key: i, value: i, text: i }}));
}

function filteredResults(){
    var self = this;
    var results = self.results;
    var races = self.races;

    if(self.filter.year !== ""){
        races = races.filter(r => r.year === self.filter.year);
    }
    if(self.filter.month !== ""){
        races = races.filter(r => r.month === self.filter.month);
    }
    if(self.filter.race !== ""){
        races = races.filter(r => r.date === self.filter.race);
    }

    var race_ids = races.map(r => r.id);
    results = self.results.filter(r => race_ids.indexOf(r.race_id) >= 0);

    var aggregated = aggregateResults(results);

    if(self.filter.racer != ""){
        aggregated = aggregated.filter(r => r.name.toLowerCase().includes(self.filter.racer.toLowerCase()));
    }

    return aggregated;
}

function watchMonth(val){
    this.filter.race = "";
}

function watchYear(val){
    this.filter.month = "";
}

function aggregateResults(results){
    var leaders = {};
    results.forEach(r => {
        var id = r.user_id;
        var user = null;
        if(Object.keys(leaders).indexOf(id) >= 0){
            user = leaders[id];
        }else{
            user = {
                id,
                name: r.user_name,
                points: 0,
                crashes: 0,
                races: 0
            }
            leaders[id] = user;
        }

        user.points += r.points;
        user.races += 1;
        user.name = r.user_name;
        if(r.note === 'CRASHED'){
            user.crashes += 1;
        }
    });
    var output = Object.keys(leaders).map(k => leaders[k]);

    var sorted = output.sort((a, b) => b.points - a.points);

    for(let i = 0, len = sorted.length; i < len; i++){
        sorted[i].rank = i + 1;
    }

    return sorted;
}

const Leaderboard = {
    template: `<div>
        <div style="margin-top:2em;">
            <div class="ui huge header centered">Fantastic Ultimate Cart Kerfuffle League</div>
            <sui-form>
                <sui-grid :columns=15 centered>
                    <sui-grid-column :width=5>
                        <sui-form-field>
                            <label>Year</label>
                            <sui-dropdown
                                :options="mappedYears"
                                placeholder="Year"
                                selection
                                v-model="filter.year"
                            />
                        </sui-form-field>
                    </sui-grid-column>
                    <sui-grid-column :width=5>
                        <sui-form-field>
                            <label>Month</label>
                            <sui-dropdown
                                :options="filteredMonths"
                                placeholder="Month"
                                :class="filter.year === '' ? 'disabled' : ''"
                                selection
                                v-model="filter.month"
                            />
                        </sui-form-field>
                    </sui-grid-column>
                    <sui-grid-column :width=5>
                        <sui-form-field>
                            <label>Race</label>
                            <sui-dropdown
                                :options="filteredRaces"
                                placeholder="Race"
                                selection
                                v-model="filter.race"
                            />
                        </sui-form-field>
                    </sui-grid-column>
                    <sui-grid-column :width=15>
                        <sui-form-field>
                            <sui-input
                                placeholder="Search Racer..."
                                icon="search"
                                v-model="filter.racer"
                            />
                        </sui-form-field>
                    </sui-grid-column>
                </sui-grid>
            </sui-form>
        </div>
        <div class="ui big header centered">
            <span v-if="filter.race !== ''">
                Results for Race on {{filter.race}}
            </span>
            <span v-else>
                Leaderboard
                <span v-if="filter.year !== '' || filter.month !== ''">for</span>
                <span v-if="filter.month !== ''">{{filter.month}}</span>
                <span v-if="filter.year !== ''">{{filter.year}}</span>
            </span>
        </div>
        <sui-table celled>
            <sui-table-header>
                <sui-table-row>
                    <sui-table-header-cell>Rank</sui-table-header-cell>
                    <sui-table-header-cell>Racer</sui-table-header-cell>
                    <sui-table-header-cell>Points</sui-table-header-cell>
                    <sui-table-header-cell v-if="filter.race === ''">Races</sui-table-header-cell>
                    <sui-table-header-cell>Crashes</sui-table-header-cell>
                </sui-table-row>
            </sui-table-header>
            <sui-table-body>
                <sui-table-row v-for="racer in filteredResults">
                    <sui-table-cell>{{racer.rank}}</sui-table-cell>
                    <sui-table-cell><router-link :to="{ name: 'racer', params: { id: racer.id } }">{{racer.name}}</router-link></sui-table-cell>
                    <sui-table-cell>{{racer.points}}</sui-table-cell>
                    <sui-table-cell v-if="filter.race === ''">{{racer.races}}</sui-table-cell>
                    <sui-table-cell>{{racer.crashes}}</sui-table-cell>
                </sui-table-row>
            </sui-table-body>
        </sui-table>
    </div>`,
    data: () => ({
        races: [],
        results: [],
        filterOptions: {
            racers: [],
            years: [],
            months: [],
            races: []
        }
    }),
    computed: {
        mappedYears,
        filteredMonths,
        filteredRaces,
        filteredResults
    },
    watch: {
        'filter.month': watchMonth,
        'filter.year': watchYear
    },
    props: ['races', 'results', 'filter']
}