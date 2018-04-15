package gov.nist.hit.hl7;

import javax.annotation.PostConstruct;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
@ComponentScan({"gov.nist.hit.hl7.igamt.configuration","gov.nist.hl7.igamt.shared.authentication","gov.nist.hit.hl7.auth.util"})

public class BootstrapApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(BootstrapApplication.class, args);
		
	}

	@Bean
	public ShaPasswordEncoder encoder() {
		return new ShaPasswordEncoder(256);
	}
//	 @Bean
//	  public FilterRegistrationBean jwtFilter() {
//	        final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
//	        registrationBean.setFilter(new JwtFilter());
//	        registrationBean.addUrlPatterns("/api/*");
//
//	        return registrationBean;
//	 }


	@Override
	public void run(String... arg0) throws Exception {
		
	//  accountService.findAll().get(0).getFullName();
  // 	List<Valueset> all = repo.findByDomainInfoScopeAndDomainInfoVersion("HL7STANDARD","2.7");
//	    List<Valueset> bindingIdentifier = repo.findByBindingIdentifier("0001");
 //	    List<Valueset> scope = repo.findByDomainInfoScope("HL7STANDARD");
 //	    List<Valueset> scopeVersionIdentifier = repo.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier("HL7STANDARD", "2.7", "0001");
//
 //	List<Valueset> versionAndIDen=repo.findByDomainInfoScopeAndBindingIdentifier("HL7STANDARD", "0001");
//	
//System.out.println(all.size());
//	System.out.println(bindingIdentifier.size());
//	System.out.println(scope.size());
//	System.out.println(scopeVersionIdentifier.size());
//	System.out.println(versionAndIDen.size());


	
	}
	@PostConstruct
	void  converAccounts() {
//		try {
//			Privilege user= 	new Privilege("USER");
//			Privilege admin = 	new Privilege("ADMIN");
//			
//			priviliges.save(user);
//			priviliges.save(admin);
//			
//			accountService.createAccountsFromLegacy();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
	}
}
