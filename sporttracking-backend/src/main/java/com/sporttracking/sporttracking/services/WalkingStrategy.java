package com.sporttracking.sporttracking.services;

public class WalkingStrategy implements CalorieCalculatorStrategy{

    @Override
    public long calculate(long duration, long weight) {
        return (long) (duration * 2.5 * 3.5 * weight / 200);
    }
}
