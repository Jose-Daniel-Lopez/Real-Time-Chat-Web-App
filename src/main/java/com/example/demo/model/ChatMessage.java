package com.example.demo.model;

import lombok.*;
import java.awt.*;

//Lombok annotations to avoid boilet-plate code
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String content;
    private String sender;
    private MessageType type;
}
