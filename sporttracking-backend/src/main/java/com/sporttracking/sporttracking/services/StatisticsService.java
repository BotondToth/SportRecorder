package com.sporttracking.sporttracking.services;

import org.springframework.http.HttpHeaders;

import java.util.Date;
import java.util.Map;

public interface StatisticsService {
    Map<String, Long> getStatisticsForUser(HttpHeaders headers, Date from, Date to, String mode);
}
