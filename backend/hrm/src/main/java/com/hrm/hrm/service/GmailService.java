package com.hrm.hrm.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Properties;

@Service
public class GmailService {

    @Value("${google.gmail.user}")
    private String gmailUser;

    private Gmail getGmailService(Credential credential) throws Exception {
        if (credential == null) {
            throw new IllegalArgumentException("OAuth2 Credential is required.");
        }
        return new Gmail.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                credential
        ).setApplicationName("hrm-gmail-api").build();
    }

    public void sendAuthCode(String to, String code, Credential credential) throws Exception {
        Gmail service = getGmailService(credential);
        MimeMessage email = createEmail(to, gmailUser, "인증코드 안내", buildEmailBody(code));
        Message message = createMessageWithEmail(email);
        service.users().messages().send(gmailUser, message).execute();
    }

    private String buildEmailBody(String code) {
        return "<p>안녕하세요.</p>" +
               "<p>아래 인증코드를 입력해주세요:</p>" +
               "<h2>" + code + "</h2>" +
               "<p>이 코드는 3분간 유효합니다.</p>";
    }

    private MimeMessage createEmail(String to, String from, String subject, String bodyHtml) throws MessagingException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(from));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject, "UTF-8");
        email.setContent(bodyHtml, "text/html; charset=UTF-8");
        return email;
    }

    private Message createMessageWithEmail(MimeMessage email) throws MessagingException, IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] bytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(bytes);
        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }
}
