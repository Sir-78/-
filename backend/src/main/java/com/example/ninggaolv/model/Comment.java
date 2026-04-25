package com.example.ninggaolv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
  private String id;
  private String postId;
  private String content;
  private String nickName;
  private String avatarUrl;
  private Long ts;
}
