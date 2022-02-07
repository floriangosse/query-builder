type FilterTuples = [
    [StringFilter, typeof createStringFilter],
    [StringNullableFilter, typeof createStringNullableFilter],
    [NumberFilter, typeof createNumberFilter],
    [NumberNullableFilter, typeof createNumberNullableFilter]
];

export type Filter = FilterTuples[number][0];
export type FilterCreator = FilterTuples[number][1];

type FindFilterCreator_<F extends Filter, T extends FilterTuples[number]> = T extends [F, any]
    ? [F, any] extends T
        ? T[1]
        : never
    : never;
export type FindFilterCreator<F extends Filter> = FindFilterCreator_<F, FilterTuples[number]>;

export function createEntityFilterDefinition<
    Entity extends {},
    EntityFieldFilterRules extends { [Key in keyof Entity]: Filter }
>(
    entityFilterRuleCreators: {
        [Key in keyof Entity]: ReturnType<FindFilterCreator<EntityFieldFilterRules[Key]>>;
    }
) {
    // Entity filter creator
    return (entityFilterRules: Partial<EntityFieldFilterRules>) => {
        const filterRuleDefinitionKeys = Object.keys(entityFilterRules) as (keyof Entity)[];

        // Entity filter
        return (data: Entity) => {
            return filterRuleDefinitionKeys.every((key) => {
                const createFieldFilter = entityFilterRuleCreators[key];
                const fieldFilterDefinition = entityFilterRules[key];

                if (!fieldFilterDefinition || !createFieldFilter || typeof createFieldFilter !== 'function') {
                    return true;
                }

                const filter = createFieldFilter(fieldFilterDefinition);

                return filter(data[key]);
            });
        };
    };
}

export type IdFilter = {
    equals?: string;

    not?: IdFilter;
};

export function createIdFilter() {
    const check = (filter: IdFilter, value: string): boolean => {
        if (typeof filter.not !== 'undefined') {
            return !check(filter.not, value);
        }

        if (typeof filter.equals !== 'undefined') {
            return value === filter.equals;
        }
        return true;
    };

    return (filter: IdFilter) => {
        return (value: string) => check(filter, value);
    };
}

export type StringFilter = {
    equals?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;

    not?: StringFilter;
};

export function createStringFilter() {
    const check = (filter: StringFilter, value: string): boolean => {
        if (typeof filter.not !== 'undefined') {
            return !check(filter.not, value);
        }

        if (typeof filter.equals !== 'undefined') {
            return value === filter.equals;
        }

        if (typeof filter.startsWith !== 'undefined') {
            return value.startsWith(filter.startsWith);
        }

        if (typeof filter.endsWith !== 'undefined') {
            return value.endsWith(filter.endsWith);
        }

        if (typeof filter.contains !== 'undefined') {
            return value.includes(filter.contains);
        }

        return true;
    };

    return (filter: StringFilter) => {
        return (value: string) => check(filter, value);
    };
}

export type StringNullableFilter = {
    equals?: string | null;
    contains?: string;
    startsWith?: string;
    endsWith?: string;

    not?: StringNullableFilter;
};

export function createStringNullableFilter() {
    const check = (filter: StringNullableFilter, value: string | null): boolean => {
        if (typeof filter.not !== 'undefined') {
            return !check(filter.not, value);
        }

        if (typeof filter.equals !== 'undefined') {
            return value === filter.equals;
        }

        if (typeof filter.startsWith !== 'undefined') {
            return typeof value === 'string' ? value.startsWith(filter.startsWith) : false;
        }

        if (typeof filter.endsWith !== 'undefined') {
            return typeof value === 'string' ? value.endsWith(filter.endsWith) : false;
        }

        if (typeof filter.contains !== 'undefined') {
            return typeof value === 'string' ? value.includes(filter.contains) : false;
        }

        return true;
    };

    return (filter: StringNullableFilter) => {
        return (value: string | null) => check(filter, value);
    };
}

export type NumberFilter = {
    equals?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;

    not?: NumberFilter;
};

export function createNumberFilter() {
    const check = (filter: NumberFilter, value: number): boolean => {
        if (typeof filter.not !== 'undefined') {
            return !check(filter.not, value);
        }

        if (typeof filter.equals !== 'undefined') {
            return value === filter.equals;
        }

        if (typeof filter.gt !== 'undefined') {
            return value > filter.gt;
        }

        if (typeof filter.gte !== 'undefined') {
            return value >= filter.gte;
        }

        if (typeof filter.lt !== 'undefined') {
            return value < filter.lt;
        }

        if (typeof filter.lte !== 'undefined') {
            return value <= filter.lte;
        }

        return true;
    };

    return (filter: NumberFilter) => {
        return (value: number) => check(filter, value);
    };
}

export type NumberNullableFilter = {
    equals?: number | null;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;

    not?: NumberNullableFilter;
};

export function createNumberNullableFilter() {
    const check = (filter: NumberNullableFilter, value: number | null): boolean => {
        if (typeof filter.not !== 'undefined') {
            return !check(filter.not, value);
        }

        if (typeof filter.equals !== 'undefined') {
            return value === filter.equals;
        }

        if (typeof filter.gt !== 'undefined') {
            return typeof value === 'number' ? value > filter.gt : false;
        }

        if (typeof filter.gte !== 'undefined') {
            return typeof value === 'number' ? value >= filter.gte : false;
        }

        if (typeof filter.lt !== 'undefined') {
            return typeof value === 'number' ? value < filter.lt : false;
        }

        if (typeof filter.lte !== 'undefined') {
            return typeof value === 'number' ? value <= filter.lte : false;
        }

        return true;
    };

    return (filter: NumberNullableFilter) => {
        return (value: number | null) => check(filter, value);
    };
}
