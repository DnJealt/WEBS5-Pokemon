module.exports = {
    normal:{
        fight:2,
        ghost:0
    },

    fight:{
        flying:2,
        rock:0.5,
        bug:0.5,
        psychic:2,
        dark:0.5,
        fairy:2
    },

    flying:{
        fight:0.5,
        ground:0,
        rock:2,
        bug:0.5,
        grass:0.5,
        electric:2,
        ice:2
    },

    poison:{
        fight:0.5,
        poison:0.5,
        ground:2,
        bug:0.5,
        grass:0.5,
        psychic:2,
        fairy:0.5
    },

    ground:{
        poison:0.5,
        rock:0.5,
        water:2,
        grass:2,
        electric:0,
        ice:2
    },

    rock:{
        normal:0.5,
        fight:2,
        flying:0.5,
        poison:0.5,
        ground:2,
        steel:2,
        fire:0.5,
        water:2,
        grass:2
    },

    bug:{
        fight:0.5,
        flying:2,
        ground:0.5,
        rock:2,
        fire:2,
        grass:0.5
    },

    ghost:{
        normal:0,
        fight:0,
        flying:,
        poison:0.5,
        bug:0.5,
        ghost:2,
        dark:2
    },

    steel:{
        normal:0.5,
        fight:2,
        flying:0.5,
        poison:0,
        ground:2,
        rock:0.5,
        bug:0.5,
        steel:0.5,
        fire:2,
        grass:0.5,
        psychic:0.5,
        ice:0.5,
        dragon:0.5,
        fairy:0.5
    },

    fire:{
        ground:2,
        rock:2,
        bug:0.5,
        steel:0.5,
        fire:0.5,
        water:2,
        grass:0.5,
        ice:0.5,
        fairy:0.5
    },

    water:{
        steel:0.5,
        fire:0.5,
        water:0.5,
        grass:2,
        electric:2,
        ice:0.5
    },

    grass:{
        flying:2,
        poison:2,
        ground:0.5,
        bug:2,
        fire:2,
        water:0.5,
        grass:0.5,
        electric:0.5,
        ice:2
    },

    electric:{
        flying:0.5,
        ground:2,
        steel:0.5,
        electric:0.5
    },

    psychic:{
        fight:0.5,
        bug:2,
        ghost:2,
        psychic:0.5,
        dark:2
    },

    ice:{
        fight:2,
        rock:2,
        steel:2,
        fire:2,
        ice:0.5
    },

    dragon:{
        fire:0.5,
        water:0.5,
        grass:0.5,
        electric:0.5,
        ice:2,
        dragon:2,
        fairy:2
    },

    dark:{
        fight:2,
        bug:2,
        ghost:0.5,
        psychic:0,
        dark:0.5,
        fairy:2
    },
    
    fairy:{
        fight:0.5,
        poison:2,
        bug:0.5,
        steel:2,
        dragon:0,
        dark:0.5
    }
};
