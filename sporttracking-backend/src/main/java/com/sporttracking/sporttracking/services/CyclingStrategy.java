package com.sporttracking.sporttracking.services;

public class CyclingStrategy implements CalorieCalculatorStrategy {
    @Override
    public long calculate(final long duration, final long weight) {
        return (long) (duration * 5 * 3.5 * weight / 200);
    }
}
