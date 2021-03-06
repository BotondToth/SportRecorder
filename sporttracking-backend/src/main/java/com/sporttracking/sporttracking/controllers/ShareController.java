package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.data.dto.BulkShareDTO;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.data.dto.ShareDTO;
import com.sporttracking.sporttracking.exceptions.NotFriendException;
import com.sporttracking.sporttracking.exceptions.ShareAlreadyExistException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.exceptions.WorkoutNotFoundException;
import com.sporttracking.sporttracking.services.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ShareController implements BaseController {

    @Autowired
    private ShareService shareService;

    @PostMapping("/shares")
    public Share saveShare(@RequestHeader final HttpHeaders headers, @RequestBody final ShareDTO shareDTO) throws WorkoutNotFoundException, UserNotFoundException, ShareAlreadyExistException, NotFriendException {
        return shareService.createShare(headers, shareDTO);
    }

    @PostMapping("/bulkShares")
    public List<Share> bulkCreateShares (@RequestHeader final HttpHeaders headers, @RequestBody final BulkShareDTO bulkShareDTO) throws UserNotFoundException, ShareAlreadyExistException, NotFriendException, WorkoutNotFoundException {
        return shareService.bulkCreateShares(headers, bulkShareDTO);
    }

    @GetMapping("/shares-from")
    public List<Share> getSharesFromUser(@RequestHeader final HttpHeaders headers) {
        return shareService.getSharesFromUser(headers);
    }

    @GetMapping("/shares-to")
    public List<Share> getSharesToUser(@RequestHeader final HttpHeaders headers) {
        return shareService.getSharesToUser(headers);
    }
}
