package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.services.StatisticsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
public class StatisticsController implements BaseController {

    @Autowired
    private StatisticsServiceImpl statisticsService;

    @GetMapping("/statistics")
    public Map<String, Long> getStatisticsForUser(
            @RequestHeader final HttpHeaders headers,
            @RequestParam(name = "from") final Long from,
            @RequestParam(name = "to") final Long to,
            @RequestParam(name = "mode") final String mode) {
        return statisticsService.getStatisticsForUser(headers, new Date(from), new Date(to), mode);
    }
}
