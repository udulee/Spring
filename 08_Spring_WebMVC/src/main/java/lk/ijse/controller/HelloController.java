package lk.ijse.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.nio.file.Path;

@Controller
@RequestMapping(path="hello")
public class HelloController {
    public HelloController(){
        System.out.println("HelloController Constructor" );
    }
    public String Hello(){
        return "hello";
    }
    @GetMapping
    public String hello(){
        return "hello";
    }

}
