const RacerProfile = {
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
                </sui-grid>
            </sui-form>
            <div class="ui header centered">
                <router-link to="/">Back to Leaderboard</router-link>
            </div>
        </div>
        <div class="ui big header" v-if="!!racer">
            {{racer.name}} - {{racer.points}} Points
            <span v-if="filter.race !== ''">
                from Race on <router-link :to="{ name: 'leaderboard', params: { filter: { race: filter.race } } }">{{filter.race}}</router-link>
            </span>
            <span v-else>
                <span v-if="filter.year !== '' || filter.month !== ''">for</span>
                <span v-if="filter.month !== ''">{{filter.month}}</span>
                <span v-if="filter.year !== ''">{{filter.year}}</span>
            </span>
        </div>
        <sui-table celled>
            <sui-table-header>
                <sui-table-row>
                    <sui-table-header-cell>Race</sui-table-header-cell>
                    <sui-table-header-cell>Track</sui-table-header-cell>
                    <sui-table-header-cell>Laps</sui-table-header-cell>
                    <sui-table-header-cell>Car</sui-table-header-cell>
                    <sui-table-header-cell>Position</sui-table-header-cell>
                    <sui-table-header-cell>Points</sui-table-header-cell>
                    <sui-table-header-cell>Note</sui-table-header-cell>
                </sui-table-row>
            </sui-table-header>
            <sui-table-body>
                <sui-table-row v-for="row in filteredIndividualResults">
                    <sui-table-cell>{{row.race.date}}</sui-table-cell>
                    <sui-table-cell>{{row.race.track}}</sui-table-cell>
                    <sui-table-cell>{{row.race.laps}}</sui-table-cell>
                    <sui-table-cell>{{row.car}}</sui-table-cell>
                    <sui-table-cell>{{row.position}}</sui-table-cell>
                    <sui-table-cell>{{row.points}}</sui-table-cell>
                    <sui-table-cell>{{row.note}}</sui-table-cell>
                </sui-table-row>
            </sui-table-body>
        </sui-table>
    </div>`,
    data: () => ({
        races: [],
        results: [],
        filter: {
            year: "",
            month: "",
            race: "",
            racer: ""
        },
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
        filteredResults,
        racer: function(){
            return this.filteredResults.find(r => r.id === this.racerId);
        },
        filteredIndividualResults: function(){
            return this.results.filter(row => row.user_id == this.racerId)
                .map(row => ({...row, race: this.races.find(race => race.id === row.race_id)}))
                .filter(row => row.race.year == this.filter.year || this.filter.year === "")
                .filter(row => row.race.month == this.filter.month || this.filter.month === "")
                .filter(row => row.race.date == this.filter.race || this.filter.race === "")
                .sort((a, b) => b.race_id - a.race_id);
        }
    },
    watch: {
        'filter.month': watchMonth,
        'filter.year': watchYear
    },
    props: ['races', 'results', 'racerId']
}