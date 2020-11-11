package com.sporttracking.sporttracking.services;

public class RunningStrategy implements CalorieCalculatorStrategy {
    @Override
    public long calculate(final long duration, final long weight) {
        return (long) (duration * 8 * 3.5 * weight / 200);
    }
}
