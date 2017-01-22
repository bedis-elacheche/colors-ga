window.onload = function() {
    var displayCitizen = function(color) {
        var container = document.getElementById('demo-container');
        var rect = document.createElement('div');
        container.appendChild(rect);
        rect.classList.add('rect');
        rect.style.backgroundColor = '#' + color;
    };
    var log = function(message) {
        var container = document.getElementById('logger');
        container.innerHTML += '<br>' + message;
    };
    var clearLog = function() {
        document.getElementById('logger').innerHTML = '';
    };
    var getRandomColor = function() {
        return '0123456789abcdef'.split('').map(function(v, i, a) {
            return i > 5 ? null : a[Math.floor(Math.random() * 16)]
        }).join('');
    };
    var drawPopulation = function(population, goal) {
        var container = document.getElementById('demo-container');
        container.innerHTML = '';
        displayCitizen(goal);
        container.append(document.createElement('br'));
        for (var i = 0; i < population.length; i++) {
            displayCitizen(population[i]);
        };
    };
    var naturalSelection = function(population, goal, max) {
        var calculateFitness = function(citizen, goal) {
            return 1 - (parseInt(goal, 16) ^ parseInt(citizen, 16)) / 16777215;
        };
        var selectByFitness = function(population, goal) {
            var mostFit = [];
            for (var i = population.length - 1; i >= 0; i--) {
                var color = population[i];
                mostFit.push({
                    color: color,
                    fitness: calculateFitness(color, goal)
                });
            };
            mostFit = mostFit.sort(function(a, b) {
                return a.fitness < b.fitness
            }).slice(0, max / 2);
            return {
                population: mostFit.map(function(item) {
                    return item.color;
                }),
                fitness: mostFit.reduce(function(a, b) {
                    return a + b.fitness;
                }, 0) / (max / 2)
            };
        };
        var nextGeneration = function(population) {
            var nextGeneration = [];
            var getKids = function(dad, mom) {
                var red = [dad.substr(0, 2), mom.substr(0, 2)];
                var green = [dad.substr(2, 2), mom.substr(2, 2)];
                var blue = [dad.substr(4, 2), mom.substr(4, 2)];
                var randomOffset = Math.floor(Math.random() * 2) * (Math.random() > 0.5 ? 1 : -1);
                var i = Math.floor(Math.random() * 3);
                var random = function(array, offset) {
                    var randomInt = Math.max(Math.min(parseInt(array[Math.round(Math.random())], 16) + offset, 255), 0).toString(16);
                    return randomInt.length === 1 ? '0' + randomInt : randomInt;
                };
                return Array.apply(null, Array(6)).map(function(item) {
                    return random(red, i === 0 ? randomOffset : 0) + random(green, i === 1 ? randomOffset : 0) + random(blue, i === 2 ? randomOffset : 0);
                });
            };
            var length = population.length;
            for (var i = length - 1; i >= 0; i--) {
                var dad = population[i];
                var mom = population[Math.floor(Math.random() * length)];
                nextGeneration = nextGeneration.concat(getKids(dad, mom));
            };
            return nextGeneration.sort(function(item) {
                return 0.5 > Math.random();
            }).slice(0, max);
        };
        drawPopulation(population, goal);
        var mostFit = selectByFitness(population, goal);
        return {
            population: nextGeneration(mostFit.population),
            fitness: mostFit.fitness
        };
    };
    var POPULATION = 1000;
    var GENERATIONS = 50;
    var goal = getRandomColor();
    var initPopulation = function(max) {
        var population = [];
        for (var i = 0; i < max; i++) {
            population.push(getRandomColor());
        };
        return population;
    };
    var population = initPopulation(POPULATION);
    var i = 0;
    (function() {
        clearLog();
        log('Goal: ' + goal);
        log('Population: ' + POPULATION);
        log('Generation: ' + i);
        var selection = naturalSelection(population, goal, POPULATION);
        population = selection.population;
        log('Fitness: ' + selection.fitness);
        if (selection.fitness === 1) {
            if (confirm('Got the wanted population! Retry ?')) {
                location.reload();
            }
        } else if (++i < GENERATIONS) {
            setTimeout(arguments.callee, 250);
        } else {
            drawPopulation(population, goal);
        }
    })();
};