import collections
import operator

from persistence import Faction

COUNT_MEASURE       = 'COUNT_MEASURE'
POINT_COST_MEASURE  = 'POINT_COST_MEASURE'
FACTION_SHIP_ROLLUP = 'FACTION_SHIP_ROLLUP'

releases = {
    "2012-9" : "Wave 1",
    "2013-2" : "Wave 2",
    "2013-9" : "Wave 3",
    "2014-2" : "Wave 4",
    "2014-6" : "Wave 5",
    "2015-2" : "Wave 6",
    "2015-8" : "Wave 7",
    "2015-11": "Wave 8 (T-70, Tie/FO)",
    "2014-3" : "Imperial Aces",
    "2014-9" : "Rebel Aces",
    "2014-4" : "Rebel Transport",
    "2014-5" : "Tantive IV",
    "2015-6" : "Imperial Raider",
    "2015-12" : "Imperial Assault Carrier",
}

class HighChartGraph:
    def __init__(self):
        self.options = {}
        self.categories_lookup = {}
        self.category_index = 0

    def get_options(self):
        return self.options

    def num_categories(self):
        return self.category_index

    def add_series(self, series):
        self.options['series'].append(series)

    def finalize(self):
        sorted_categories = []
        final_data = []
        self.options['xAxis']['categories'] = []

        years = sorted(self.categories_lookup.keys())
        for year in years:
            months = sorted(self.categories_lookup[year])
            for month in months:
                sorted_categories.append(str(year) + "-" + str(month))
                final_data.append(0)
        self.options['xAxis']['categories'] = sorted_categories

        #now figure out which series is missing which data
        final_series = {}

        for series in self.options['series']:
            i = 0
            data       = series['data']
            final_data_for_series = list(final_data)
            for year_mo in sorted_categories:
                if data.has_key(year_mo):
                    value = data[year_mo]
                    final_data_for_series[i] = value
                i += 1
            series['data'] = final_data_for_series




    def add_plot_line(self,year_mo, position):
        text = releases[year_mo]
        xAxis = self.options['xAxis']
        if releases.has_key(year_mo):
            xAxis['plotLines'].append(
                {
                    'color' : 'red',
                    'value' : position,
                    'width' : 2,
                    'label' : {
                        'text': text,
                        'verticalAlign': 'left',
                        'textAlign': 'top'
                    }
                }
            )

    def add_category(self, category_str):
        (year,mo) = category_str.split("-")
        year = int(year)
        mo   = int(mo)
        if not self.categories_lookup.has_key(year):
            self.categories_lookup[year] = {}
        if not self.categories_lookup[year].has_key(mo):
            self.categories_lookup[year][mo] = 0
            self.category_index +=1
            if releases.has_key(category_str):
                self.add_plot_line(category_str, self.category_index-1)

        self.categories_lookup[year][mo] += 1

class HighChartAreaGraphOptions(HighChartGraph):

    def __init__(self, title, yaxis_label, subtitle='', chart_type=None, plot_options=None ):
        HighChartGraph.__init__(self)
        self.options = {
        'chart': {
            'type': 'area'
        },
        'title': {
            'text': title,
        },
        'subtitle': {
            'text': subtitle
        },
        'xAxis': {
            'categories': [],
            'tickmarkPlacement': 'on',
            'title': {
                'enabled': 'false'
            },
            'plotLines' : [],
        },
        'yAxis': {
            'title': {
                'text': yaxis_label
            }
        },
        'tooltip': {
            'pointFormat': '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
            'shared': 'true'
        },
        'plotOptions': {
            'area': {
                'stacking': 'percent',
                'lineColor': '#ffffff',
                'lineWidth': 1,
                'marker': {
                    'lineWidth': 1,
                    'lineColor': '#ffffff'
                }
            }
        },
        'series': []
    }

class HighChartLineGraphOptions(HighChartGraph):
    def __init__(self, title, yaxis_label, subtitle='', chart_type=None, is_area=False):
        HighChartGraph.__init__(self)
        self.options = {
            'title': {
                'text': title,
                'x': -20 #center
            },
            'subtitle': {
                'text': subtitle,
                'x': -20
            },
            'yAxis': {
                'title': {
                    'text': yaxis_label,
                },
                'plotLines': [
                    {
                        'value': 0,
                        'width': 1,
                        'color': '#808080'
                    }
                ]
            },
           'tooltip': {
                'valueSuffix': ''
            },

            'xAxis': {
                'categories' : [],
                'tickerPlacement' :'on',
                'title' : { 'enabled': "false" },
                'plotLines' : [],
            },
            'series': [],
            'plotOptions' : {}

        }

        if chart_type is not None:
            self.options['chart'] = chart_type

        if is_area:
            plotOptions = self.options['plotOptions']
            plotOptions = {
                 'area': {
                        'fillColor': {
                            'linearGradient': {
                                'x1': 0,
                                'y1': 0,
                                'x2': 0,
                                'y2': 1
                            },
                            'stops': [
                                [0, "#7cb5ec"],
                                [1, "#7cb6ef"]
                            ],
                        },
                        'marker': {
                            'radius': 2
                        },
                        'lineWidth': 1,
                        'states': {
                            'hover': {
                                'lineWidth': 1
                            }
                        },
                        'threshold': ""
                    }
                }

class ShipTotalHighchartOptions:

    def __init__(self, ship_pilot_time_series_data,show_as_count=False):
        hclgo = None
        self.show_as_count = show_as_count
        yaxis_label = "Number of ships taken"
        if show_as_count == False:
            yaxis_label = "Points spent on ships"
        hclgo = HighChartLineGraphOptions(title="Total",
                                          yaxis_label=yaxis_label,
                                          is_area=True)

        self.options = hclgo.get_options()
        self.hclgo = hclgo
        self.finalize(ship_pilot_time_series_data)

    def finalize(self,ship_pilot_time_series_data):
        data = ship_pilot_time_series_data.grand_total_data
        series = { 'name': 'Total', 'type': 'area', 'data': collections.OrderedDict()}
        for year_mo in data.keys():
            (year,month) = year_mo.split("-")
            self.hclgo.add_category(year_mo)
            series['data'][year_mo] = data[year_mo]
        self.hclgo.add_series(series)
        self.hclgo.finalize()

class FactionTotalHighChartOptions:
    def __init__(self, ship_pilot_time_series_data,show_as_percentage=True,show_as_count=False):
        self.show_as_count=show_as_count
        hclgo = None

        yaxis_label = "Number of ships taken"
        if show_as_count == False:
            yaxis_label = "Points spent on ships"
        if not show_as_percentage:
            hclgo = HighChartLineGraphOptions(title="Factions",
                                              yaxis_label=yaxis_label )
        else:
            hclgo = HighChartAreaGraphOptions(title="Faction Percentage", yaxis_label=yaxis_label)
        self.options = hclgo.get_options()
        self.hclgo = hclgo
        self.finalize(ship_pilot_time_series_data)

    def finalize(self,ship_pilot_time_series_data):
        data = ship_pilot_time_series_data.faction_data
        for faction in data.keys():
            series = { 'name': faction, 'data': collections.OrderedDict()}
            for year_mo in data[faction].keys():
                self.hclgo.add_category(year_mo)
                series['data'][year_mo] =  data[faction][year_mo]
            self.hclgo.add_series(series)
        self.hclgo.finalize()

class ShipHighchartOptions:
    def __init__(self, ship_pilot_time_series_data,
                 ships_and_factions,
                 show_as_count=False,
                 show_as_percentage=True,
                 rebel_checked=True,
                 scum_checked=True,
                 imperial_checked=True,
                 top_10_only=True):

        hclgo = None

        yaxis_label = "Number of ships taken"
        if show_as_count == False:
            yaxis_label = "Points spent on ships"

        if not show_as_percentage:
            hclgo = HighChartLineGraphOptions(title="Ships",
                                              yaxis_label=yaxis_label)
        else:
            hclgo = HighChartAreaGraphOptions(title="Ships", yaxis_label=yaxis_label)
        self.options = hclgo.get_options()
        self.hlcgo = hclgo
        self.finalize(ship_pilot_time_series_data,ships_and_factions,imperial_checked,rebel_checked,scum_checked,top_10_only)

    def finalize(self, ship_pilot_time_series_data,ships_and_factions,imperial_checked, rebel_checked, scum_checked,top_10_only ):
        ships_factions = {}
        for rec in ships_and_factions:
            faction = rec[0]
            sname   = rec[1].description
            if not ships_factions.has_key(sname):
                ships_factions[sname] = []
            ships_factions[sname].append(faction)

        data = ship_pilot_time_series_data.ship_data
        all_series = {}
        for faction in data.keys():
            for ship in data[faction].keys():
                disambiguated_ship_name = None
                if len(ships_factions[ship]) > 1:
                    disambiguated_ship_name = self.disambiguate_ship_by_faction(faction,ship)
                else:
                    disambiguated_ship_name = ship
                series = { 'name': disambiguated_ship_name,
                           'data': collections.OrderedDict(),
                            'visible': self.check_visible(faction, imperial_checked, rebel_checked, scum_checked) }
                for year_mo in data[faction][ship].keys():
                    self.hlcgo.add_category(year_mo)
                    val = data[faction][ship][year_mo]
                    series['data'][year_mo] = val
                all_series[disambiguated_ship_name] = series

        # #sort the series from biggest to smallest based the last months value
        unsorted = {}
        for ship in all_series.keys():
            ship_series = all_series[ship]
            last_value = ship_series['data'].values()[-1]
            unsorted[ship]=last_value

        sorted_ships = sorted(unsorted.items(), key=operator.itemgetter(1))
        i = 0
        for ship_last_val in reversed(sorted_ships):
            ship = ship_last_val[0]
            series = all_series[ship]
            if i < 10:
                if top_10_only:
                    series['visible'] = 1
            else:
                if top_10_only:
                    series['visible'] = 0
            i += 1
            self.hlcgo.add_series( all_series[ship])

        self.hlcgo.finalize()

    def disambiguate_ship_by_faction(self, faction, sname):
        return sname + "( " + faction + " )"

    def check_visible(self, faction, imperial_checked, rebel_checked, scum_checked):
        if rebel_checked == False and faction == Faction.REBEL.description:
            return 0
        if imperial_checked == False and faction == Faction.IMPERIAL.description:
            return 0
        if scum_checked == False and faction == Faction.SCUM.description:
            return 0
        return 1

class PilotHighchartOptions:
    def __init__(self, ship_pilot_time_series_data,
                 pilots_and_factions,
                 show_as_count=False,
                 show_as_percentage=True,
                 rebel_checked=True,
                 scum_checked=True,
                 imperial_checked=True,
                 top_10_only=True):

        hclgo = None

        yaxis_label = "Number of pilots taken"
        if show_as_count == False:
            yaxis_label = "Points spent on pilots"

        if not show_as_percentage:
            hclgo = HighChartLineGraphOptions(title="Pilots",
                                              yaxis_label=yaxis_label)
        else:
            hclgo = HighChartAreaGraphOptions(title="Pilots", yaxis_label=yaxis_label)
        self.options = hclgo.get_options()
        self.highchart = hclgo
        self.finalize(ship_pilot_time_series_data,pilots_and_factions,imperial_checked,rebel_checked,scum_checked,top_10_only)

    def finalize(self, ship_pilot_time_series_data,pilots_and_factions,imperial_checked, rebel_checked, scum_checked,top_10_only):
        #stupid boba fett, why must you exist in two factions? :-)
        pilot_factions = {}
        for rec in pilots_and_factions:
            faction = rec[0]
            pilot_name = rec[1]
            if not pilot_factions.has_key(pilot_name):
                pilot_factions[pilot_name] = []
            pilot_factions[pilot_name].append(faction)

        data = ship_pilot_time_series_data.pilot_data
        all_series = {}
        for faction in data.keys():
            for ship in data[faction].keys():
                for pilot in data[faction][ship].keys():
                    disambiguated_pilot_name = None
                    if len(pilot_factions[pilot]) > 1:
                        disambiguated_pilot_name = self.disambiguate(faction,pilot)
                    else:
                        disambiguated_pilot_name = pilot
                    series = { 'name': disambiguated_pilot_name,
                               'data': collections.OrderedDict(),
                               'visible': self.check_visible(faction, imperial_checked, rebel_checked, scum_checked) }
                    for year_mo in data[faction][ship][pilot].keys():
                        self.highchart.add_category(year_mo)
                        val = data[faction][ship][pilot][year_mo]
                        series['data'][year_mo] = val
                    all_series[disambiguated_pilot_name] = series

        # #sort the series from biggest to smallest based the last months value
        unsorted = {}
        for pilot in all_series.keys():
            pilot_series = all_series[pilot]
            last_value = pilot_series['data'].values()[-1]
            unsorted[pilot]=last_value

        sorted_pilots = sorted(unsorted.items(), key=operator.itemgetter(1))
        i = 0
        for pilot_last_val in reversed(sorted_pilots):
            pilot = pilot_last_val[0]
            series = all_series[pilot]
            if i < 10:
                if top_10_only:
                    series['visible'] = 1
            else:
                if top_10_only:
                    series['visible'] = 0
            i += 1
            self.highchart.add_series( all_series[pilot])

        self.highchart.finalize()


    def disambiguate(self, faction, sname):
        return sname + "( " + faction + " )"

    def check_visible(self, faction, imperial_checked, rebel_checked, scum_checked):
        if rebel_checked == False and faction == Faction.REBEL.description:
            return 0
        if imperial_checked == False and faction == Faction.IMPERIAL.description:
            return 0
        if scum_checked == False and faction == Faction.SCUM.description:
            return 0
        return 1

class ShipPilotTimeSeriesData:
    def __init__(self, pm,tourney_filters=None,show_as_count=False,show_the_cut_only=False):
        self.pm               = pm
        self.grand_total_data = collections.OrderedDict()
        self.faction_data     = collections.OrderedDict()
        self.ship_data        = collections.OrderedDict()
        self.pilot_data       = collections.OrderedDict()

        self.show_as_count     = show_as_count
        self.show_the_cut_only = show_the_cut_only

        self.ship_pilot_time_series_data = pm.get_ship_pilot_rollup(tourney_filters,show_the_cut_only)
        self.upgrade_time_series_data = pm.get_upgrade_rollups( tourney_filters,show_the_cut_only )
        self.visit_time_series_data( self.ship_pilot_time_series_data)
        self.visit_time_series_data(self.upgrade_time_series_data)


    def is_grand_total(self, faction, ship, pilot):
        return faction is None and ship is None and pilot is None

    def is_faction_total(self, faction, ship, pilot):
        return faction is not None and ship is None and pilot is None

    def is_ship_total(self, faction, ship, pilot):
       return faction is not None and ship is not None and pilot is None

    def visit_grand_total(self, year, month, cnt, cost):
        year_mo = str(year) + "-" + str(month)
        datapoint = 0
        if self.show_as_count:
            datapoint = cnt
        else:
            datapoint = cost

        if not self.grand_total_data.has_key( year_mo):
            self.grand_total_data[year_mo] = None

        if self.grand_total_data[year_mo] is None:
            self.grand_total_data[year_mo] = datapoint

        else:
            self.grand_total_data[year_mo] += datapoint

    def visit_pilot_total(self, year, month, faction,ship,pilot,cnt,cost):
        year_mo = str(year) + "-" + str(month)
        datapoint = 0
        if self.show_as_count:
            datapoint = cnt
        else:
            datapoint = cost
        if not self.pilot_data.has_key(faction):
            self.pilot_data[faction] = collections.OrderedDict()

        if not self.pilot_data[faction].has_key(ship):
            self.pilot_data[faction][ship] = collections.OrderedDict()

        if not self.pilot_data[faction][ship].has_key(pilot):
            self.pilot_data[faction][ship][pilot] = collections.OrderedDict()

        if not self.pilot_data[faction][ship][pilot].has_key(year_mo):
            self.pilot_data[faction][ship][pilot][year_mo] = 0

        self.pilot_data[faction][ship][pilot][year_mo] += datapoint


    def visit_ship_total(self, year, month, faction, ship, cnt,cost):
        year_mo = str(year) + "-" + str(month)
        datapoint = 0
        if self.show_as_count:
            datapoint = cnt
        else:
            datapoint = cost

        if not self.ship_data.has_key(faction):
            self.ship_data[faction] = collections.OrderedDict()

        if not self.ship_data[faction].has_key(ship):
            self.ship_data[faction][ship] = collections.OrderedDict()

        if not self.ship_data[faction][ship].has_key(year_mo):
            self.ship_data[faction][ship][year_mo] = 0

        self.ship_data[faction][ship][year_mo] += datapoint


    def visit_faction_total(self, year, month, faction,cnt, cost):
        year_mo = str(year) + "-" + str(month)
        datapoint = 0
        if self.show_as_count:
            datapoint = cnt
        else:
            datapoint = cost

        if not self.faction_data.has_key(faction):
            self.faction_data[faction] = collections.OrderedDict()

        data_by_faction = self.faction_data[faction]

        if not data_by_faction.has_key( year_mo):
            data_by_faction[year_mo] = None

        if data_by_faction[year_mo] is None:
            data_by_faction[year_mo] = datapoint

        else:
            data_by_faction[year_mo] += datapoint

    def visit_time_series_data(self, time_series_data):
        for row in time_series_data:
            year    = row[0]
            month   = row[1]
            faction = row[2]
            ship    = row[3]
            pilot   = row[4]
            cnt     = int(row[5])
            cost    = int(row[6])

            if faction is not None:
                faction = faction.description

            if ship is not None:
                ship = ship.description

            if year is not None and month is not None: #the rollup actually rolls up year and month!
                if self.is_grand_total( faction, ship, pilot):
                    self.visit_grand_total(year, month, cnt, cost)
                elif self.is_faction_total( faction, ship, pilot ):
                    self.visit_faction_total(year, month,faction,cnt, cost)
                elif self.is_ship_total( faction, ship, pilot):
                    self.visit_ship_total( year, month,faction, ship, cnt,cost)
                else: #full pilot row
                    self.visit_pilot_total(year, month,faction,ship,pilot,cnt,cost)

