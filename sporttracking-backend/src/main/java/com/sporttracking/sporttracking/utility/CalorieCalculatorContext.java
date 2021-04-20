package com.sporttracking.sporttracking.utility;

import com.sporttracking.sporttracking.strategies.CalorieCalculatorStrategy;
import lombok.Getter;

@Getter
public class CalorieCalculatorContext {

    private final CalorieCalculatorStrategy strategy;

    public CalorieCalculatorContext(CalorieCalculatorStrategy strategy) {
        this.strategy = strategy;
    }

    public long executeStrategy(long duration, long weight) {
        return strategy.calculate(duration, weight);
    }
}
