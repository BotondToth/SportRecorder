package com.sporttracking.sporttracking.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(origins = "http://localhost:19006", methods = {RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST})
public interface BaseController {
}
