const tlddata =
	'aaa:aarp:abarth:abb:abbott:abbvie:abc:able:abogado:abudhabi:ac:academy:accenture' +
	':accountant:accountants:aco:active:actor:ad:adac:ads:adult:ae:aeg:aero:aetna:af:' +
	'afamilycompany:afl:africa:ag:agakhan:agency:ai:aig:aigo:airbus:airforce:airtel:a' +
	'kdn:al:alfaromeo:alibaba:alipay:allfinanz:allstate:ally:alsace:alstom:am:america' +
	'nexpress:americanfamily:amex:amfam:amica:amsterdam:an:analytics:android:anquan:a' +
	'nz:ao:aol:apartments:app:apple:aq:aquarelle:ar:arab:aramco:archi:army:arpa:art:a' +
	'rte:as:asda:asia:associates:at:athleta:attorney:au:auction:audi:audible:audio:au' +
	'spost:author:auto:autos:avianca:aw:aws:ax:axa:az:azure:ba:baby:baidu:banamex:ban' +
	'anarepublic:band:bank:bar:barcelona:barclaycard:barclays:barefoot:bargains:baseb' +
	'all:basketball:bauhaus:bayern:bb:bbc:bbt:bbva:bcg:bcn:bd:be:beats:beauty:beer:be' +
	'ntley:berlin:best:bestbuy:bet:bf:bg:bh:bharti:bi:bible:bid:bike:bing:bingo:bio:b' +
	'iz:bj:bl:black:blackfriday:blanco:blockbuster:blog:bloomberg:blue:bm:bms:bmw:bn:' +
	'bnl:bnpparibas:bo:boats:boehringer:bofa:bom:bond:boo:book:booking:boots:bosch:bo' +
	'stik:boston:bot:boutique:box:bq:br:bradesco:bridgestone:broadway:broker:brother:' +
	'brussels:bs:bt:budapest:bugatti:build:builders:business:buy:buzz:bv:bw:by:bz:bzh' +
	':ca:cab:cafe:cal:call:calvinklein:cam:camera:camp:cancerresearch:canon:capetown:' +
	'capital:capitalone:car:caravan:cards:care:career:careers:cars:cartier:casa:case:' +
	'caseih:cash:casino:cat:catering:catholic:cba:cbn:cbre:cbs:cc:cd:ceb:center:ceo:c' +
	'ern:cf:cfa:cfd:cg:ch:chanel:channel:chase:chat:cheap:chintai:chloe:christmas:chr' +
	'ome:chrysler:church:ci:cipriani:circle:cisco:citadel:citi:citic:city:cityeats:ck' +
	':cl:claims:cleaning:click:clinic:clinique:clothing:cloud:club:clubmed:cm:cn:co:c' +
	'oach:codes:coffee:college:cologne:com:comcast:commbank:community:company:compare' +
	':computer:comsec:condos:construction:consulting:contact:contractors:cooking:cook' +
	'ingchannel:cool:coop:corsica:country:coupon:coupons:courses:cr:credit:creditcard' +
	':creditunion:cricket:crown:crs:cruise:cruises:csc:cu:cuisinella:cv:cw:cx:cy:cymr' +
	'u:cyou:cz:dabur:dad:dance:data:date:dating:datsun:day:dclk:dds:de:deal:dealer:de' +
	'als:degree:delivery:dell:deloitte:delta:democrat:dental:dentist:desi:design:dev:' +
	'dhl:diamonds:diet:digital:direct:directory:discount:discover:dish:diy:dj:dk:dm:d' +
	'np:do:docs:doctor:dodge:dog:doha:domains:doosan:dot:download:drive:dtv:dubai:duc' +
	'k:dunlop:duns:dupont:durban:dvag:dvr:dz:earth:eat:ec:eco:edeka:edu:education:ee:' +
	'eg:eh:email:emerck:energy:engineer:engineering:enterprises:epost:epson:equipment' +
	':er:ericsson:erni:es:esq:estate:esurance:et:etisalat:eu:eurovision:eus:events:ev' +
	'erbank:exchange:expert:exposed:express:extraspace:fage:fail:fairwinds:faith:fami' +
	'ly:fan:fans:farm:farmers:fashion:fast:fedex:feedback:ferrari:ferrero:fi:fiat:fid' +
	'elity:fido:film:final:finance:financial:fire:firestone:firmdale:fish:fishing:fit' +
	':fitness:fj:fk:flickr:flights:flir:florist:flowers:flsmidth:fly:fm:fo:foo:food:f' +
	'oodnetwork:football:ford:forex:forsale:forum:foundation:fox:fr:free:fresenius:fr' +
	'l:frogans:frontdoor:frontier:ftr:fujitsu:fujixerox:fun:fund:furniture:futbol:fyi' +
	':ga:gal:gallery:gallo:gallup:game:games:gap:garden:gb:gbiz:gd:gdn:ge:gea:gent:ge' +
	'nting:george:gf:gg:ggee:gh:gi:gift:gifts:gives:giving:gl:glade:glass:gle:global:' +
	'globo:gm:gmail:gmbh:gmo:gmx:gn:godaddy:gold:goldpoint:golf:goo:goodhands:goodyea' +
	'r:goog:google:gop:got:gov:gp:gq:gr:grainger:graphics:gratis:green:gripe:grocery:' +
	'group:gs:gt:gu:guardian:gucci:guge:guide:guitars:guru:gw:gy:hair:hamburg:hangout' +
	':haus:hbo:hdfc:hdfcbank:health:healthcare:help:helsinki:here:hermes:hgtv:hiphop:' +
	'hisamitsu:hitachi:hiv:hk:hkt:hm:hn:hockey:holdings:holiday:homedepot:homegoods:h' +
	'omes:homesense:honda:honeywell:horse:hospital:host:hosting:hot:hoteles:hotels:ho' +
	'tmail:house:how:hr:hsbc:ht:htc:hu:hughes:hyatt:hyundai:ibm:icbc:ice:icu:id:ie:ie' +
	'ee:ifm:iinet:ikano:il:im:imamat:imdb:immo:immobilien:in:industries:infiniti:info' +
	':ing:ink:institute:insurance:insure:int:intel:international:intuit:investments:i' +
	'o:ipiranga:iq:ir:irish:is:iselect:ismaili:ist:istanbul:it:itau:itv:iveco:iwc:jag' +
	'uar:java:jcb:jcp:je:jeep:jetzt:jewelry:jio:jlc:jll:jm:jmp:jnj:jo:jobs:joburg:jot' +
	':joy:jp:jpmorgan:jprs:juegos:juniper:kaufen:kddi:ke:kerryhotels:kerrylogistics:k' +
	'erryproperties:kfh:kg:kh:ki:kia:kim:kinder:kindle:kitchen:kiwi:km:kn:koeln:komat' +
	'su:kosher:kp:kpmg:kpn:kr:krd:kred:kuokgroup:kw:ky:kyoto:kz:la:lacaixa:ladbrokes:' +
	'lamborghini:lamer:lancaster:lancia:lancome:land:landrover:lanxess:lasalle:lat:la' +
	'tino:latrobe:law:lawyer:lb:lc:lds:lease:leclerc:lefrak:legal:lego:lexus:lgbt:li:' +
	'liaison:lidl:life:lifeinsurance:lifestyle:lighting:like:lilly:limited:limo:linco' +
	'ln:linde:link:lipsy:live:living:lixil:lk:loan:loans:locker:locus:loft:lol:london' +
	':lotte:lotto:love:lpl:lplfinancial:lr:ls:lt:ltd:ltda:lu:lundbeck:lupin:luxe:luxu' +
	'ry:lv:ly:ma:macys:madrid:maif:maison:makeup:man:management:mango:map:market:mark' +
	'eting:markets:marriott:marshalls:maserati:mattel:mba:mc:mcd:mcdonalds:mckinsey:m' +
	'd:me:med:media:meet:melbourne:meme:memorial:men:menu:meo:merckmsd:metlife:mf:mg:' +
	'mh:miami:microsoft:mil:mini:mint:mit:mitsubishi:mk:ml:mlb:mls:mm:mma:mn:mo:mobi:' +
	'mobile:mobily:moda:moe:moi:mom:monash:money:monster:montblanc:mopar:mormon:mortg' +
	'age:moscow:moto:motorcycles:mov:movie:movistar:mp:mq:mr:ms:msd:mt:mtn:mtpc:mtr:m' +
	'u:museum:mutual:mutuelle:mv:mw:mx:my:mz:na:nab:nadex:nagoya:name:nationwide:natu' +
	'ra:navy:nba:nc:ne:nec:net:netbank:netflix:network:neustar:new:newholland:news:ne' +
	'xt:nextdirect:nexus:nf:nfl:ng:ngo:nhk:ni:nico:nike:nikon:ninja:nissan:nissay:nl:' +
	'no:nokia:northwesternmutual:norton:now:nowruz:nowtv:np:nr:nra:nrw:ntt:nu:nyc:nz:' +
	'obi:observer:off:office:okinawa:olayan:olayangroup:oldnavy:ollo:om:omega:one:ong' +
	':onl:online:onyourside:ooo:open:oracle:orange:org:organic:orientexpress:origins:' +
	'osaka:otsuka:ott:ovh:pa:page:pamperedchef:panasonic:panerai:paris:pars:partners:' +
	'parts:party:passagens:pay:pccw:pe:pet:pf:pfizer:pg:ph:pharmacy:phd:philips:phone' +
	':photo:photography:photos:physio:piaget:pics:pictet:pictures:pid:pin:ping:pink:p' +
	'ioneer:pizza:pk:pl:place:play:playstation:plumbing:plus:pm:pn:pnc:pohl:poker:pol' +
	'itie:porn:post:pr:pramerica:praxi:press:prime:pro:prod:productions:prof:progress' +
	'ive:promo:properties:property:protection:pru:prudential:ps:pt:pub:pw:pwc:py:qa:q' +
	'pon:quebec:quest:qvc:racing:radio:raid:re:read:realestate:realtor:realty:recipes' +
	':red:redstone:redumbrella:rehab:reise:reisen:reit:reliance:ren:rent:rentals:repa' +
	'ir:report:republican:rest:restaurant:review:reviews:rexroth:rich:richardli:ricoh' +
	':rightathome:ril:rio:rip:rmit:ro:rocher:rocks:rodeo:rogers:room:rs:rsvp:ru:rugby' +
	':ruhr:run:rw:rwe:ryukyu:sa:saarland:safe:safety:sakura:sale:salon:samsclub:samsu' +
	'ng:sandvik:sandvikcoromant:sanofi:sap:sapo:sarl:sas:save:saxo:sb:sbi:sbs:sc:sca:' +
	'scb:schaeffler:schmidt:scholarships:school:schule:schwarz:science:scjohnson:scor' +
	':scot:sd:se:search:seat:secure:security:seek:select:sener:services:ses:seven:sew' +
	':sex:sexy:sfr:sg:sh:shangrila:sharp:shaw:shell:shia:shiksha:shoes:shop:shopping:' +
	'shouji:show:showtime:shriram:si:silk:sina:singles:site:sj:sk:ski:skin:sky:skype:' +
	'sl:sling:sm:smart:smile:sn:sncf:so:soccer:social:softbank:software:sohu:solar:so' +
	'lutions:song:sony:soy:space:spiegel:spot:spreadbetting:sr:srl:srt:ss:st:stada:st' +
	'aples:star:starhub:statebank:statefarm:statoil:stc:stcgroup:stockholm:storage:st' +
	'ore:stream:studio:study:style:su:sucks:supplies:supply:support:surf:surgery:suzu' +
	'ki:sv:swatch:swiftcover:swiss:sx:sy:sydney:symantec:systems:sz:tab:taipei:talk:t' +
	'aobao:target:tatamotors:tatar:tattoo:tax:taxi:tc:tci:td:tdk:team:tech:technology' +
	':tel:telecity:telefonica:temasek:tennis:teva:tf:tg:th:thd:theater:theatre:tiaa:t' +
	'ickets:tienda:tiffany:tips:tires:tirol:tj:tjmaxx:tjx:tk:tkmaxx:tl:tm:tmall:tn:to' +
	':today:tokyo:tools:top:toray:toshiba:total:tours:town:toyota:toys:tp:tr:trade:tr' +
	'ading:training:travel:travelchannel:travelers:travelersinsurance:trust:trv:tt:tu' +
	'be:tui:tunes:tushu:tv:tvs:tw:tz:ua:ubank:ubs:uconnect:ug:uk:um:unicom:university' +
	':uno:uol:ups:us:uy:uz:va:vacations:vana:vanguard:vc:ve:vegas:ventures:verisign:v' +
	'ersicherung:vet:vg:vi:viajes:video:vig:viking:villas:vin:vip:virgin:visa:vision:' +
	'vista:vistaprint:viva:vivo:vlaanderen:vn:vodka:volkswagen:volvo:vote:voting:voto' +
	':voyage:vu:vuelos:wales:walmart:walter:wang:wanggou:warman:watch:watches:weather' +
	':weatherchannel:webcam:weber:website:wed:wedding:weibo:weir:wf:whoswho:wien:wiki' +
	':williamhill:win:windows:wine:winners:wme:wolterskluwer:woodside:work:works:worl' +
	'd:wow:ws:wtc:wtf:xbox:xerox:xfinity:xihuan:xin:测试:कॉम:परीक्षा:セール:佛山:ಭಾರತ:慈善:集团:' +
	'在线:한국:ଭାରତ:大众汽车:点看:คอม:ভাৰত:ভারত:八卦:.موقع‎:বাংলা:公益:公司:香格里拉:网站:移动:我爱你:москва:исп' +
	'ытание:қаз:католик:онлайн:сайт:联通:срб:бг:бел:.קום‎:时尚:微博:테스트:淡马锡:ファッション:орг:नेट:' +
	'ストア:삼성:சிங்கப்பூர்:商标:商店:商城:дети:мкд:.טעסט‎:ею:ポイント:新闻:工行:家電:.كوم‎:中文网:中信:中国:中國:' +
	'娱乐:谷歌:భారత్:ලංකා:電訊盈科:购物:測試:クラウド:ભારત:通販:भारतम्:भारत:भारोत:.آزمایشی‎:பரிட்சை:网店:' +
	'संगठन:餐厅:网络:ком:укр:香港:诺基亚:食品:δοκιμή:飞利浦:.إختبار‎:台湾:台灣:手表:手机:мон:.الجزائر‎:.عما' +
	'ن‎:.ارامكو‎:.ایران‎:.العليان‎:.اتصالات‎:.امارات‎:.بازار‎:.پاکستان‎:.الاردن‎:.موب' +
	'ايلي‎:.بارت‎:.بھارت‎:.المغرب‎:.ابوظبي‎:.السعودية‎:.ڀارت‎:.كاثوليك‎:.سودان‎:.همرا' +
	'ه‎:.عراق‎:.مليسيا‎:澳門:닷컴:政府:.شبكة‎:.بيتك‎:.عرب‎:გე:机构:组织机构:健康:ไทย:.سورية‎:рус:рф' +
	':珠宝:.تونس‎:大拿:みんな:グーグル:ελ:世界:書籍:ഭാരതം:ਭਾਰਤ:网址:닷넷:コム:天主教:游戏:vermögensberater:verm' +
	'ögensberatung:企业:信息:嘉里大酒店:嘉里:.مصر‎:.قطر‎:广东:இலங்கை:இந்தியா:հայ:新加坡:.فلسطين‎:テスト:' +
	'政务:xperia:xxx:xyz:yachts:yahoo:yamaxun:yandex:ye:yodobashi:yoga:yokohama:you:you' +
	'tube:yt:yun:za:zappos:zara:zero:zip:zippo:zm:zone:zuerich:zw'

const tld = new Set(tlddata.split(':'))

export function urlInfo(url: string) {
	const split = url.split('.')
	const split1 = split[0].split('@')
	let p = split.length - 1
	if (split1.length === 2) split[0] = split1[1]
	while (tld.has(split[p])) p--
	return {
		domain: split[p],
		subdomain: split.slice(0, p).join('.'),
		tld: split.slice(p + 1).join('.'),
	}
}
